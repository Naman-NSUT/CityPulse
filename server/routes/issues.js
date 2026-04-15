import { Router } from 'express'
import Issue from '../models/Issue.js'
import upload from '../middleware/upload.js'

const router = Router()

// GET /api/issues — List all issues
router.get('/', async (req, res) => {
    try {
        const { status, category, severity } = req.query
        const filter = {}
        if (status) filter.status = status
        if (category) filter.category = category
        if (severity) filter.severity = severity

        const issues = await Issue.find(filter).sort({ createdAt: -1 }).limit(100)
        res.json(issues)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/issues/stats/overview — Dashboard stats
router.get('/stats/overview', async (req, res) => {
    try {
        const [total, pending, inProgress, resolved] = await Promise.all([
            Issue.countDocuments(),
            Issue.countDocuments({ status: 'pending' }),
            Issue.countDocuments({ status: 'in-progress' }),
            Issue.countDocuments({ status: 'resolved' }),
        ])
        res.json({ total, pending, inProgress, resolved })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/issues/timeline — Historical data
router.get('/timeline', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 30
        const date = new Date()
        date.setDate(date.getDate() - days)

        const timeline = await Issue.aggregate([
            { $match: { createdAt: { $gte: date } } },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 },
                    resolvedCount: {
                        $sum: { $cond: [{ $eq: ["$status", "resolved"] }, 1, 0] }
                    }
                }
            },
            { $sort: { _id: 1 } }
        ])
        res.json(timeline.map(t => ({ date: t._id, count: t.count, resolved: t.resolvedCount })))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/issues/categories — Category breakdown
router.get('/categories', async (req, res) => {
    try {
        const categories = await Issue.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ])
        res.json(categories.map(c => ({ name: c._id || 'Unknown', value: c.count })))
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/issues/sectors — Map distribution
router.get('/sectors', async (req, res) => {
    try {
        const issues = await Issue.find({ 'location.lat': { $ne: 0 } }, 'location severity category title status')
        res.json(issues)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// GET /api/issues/:id
router.get('/:id', async (req, res) => {
    try {
        const issue = await Issue.findById(req.params.id)
        if (!issue) return res.status(404).json({ error: 'Issue not found' })
        res.json(issue)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// POST /api/issues — Create a new issue
router.post('/', upload.single('image'), async (req, res) => {
    try {
        const { title, description, category, severity, confidence, address, lat, lng } = req.body
        const issue = new Issue({
            title: title || `${category || 'General'} Issue Report`,
            description,
            category: category || 'other',
            severity: severity || 'medium',
            confidence: parseFloat(confidence) || 0,
            location: {
                lat: parseFloat(lat) || 0,
                lng: parseFloat(lng) || 0,
                address: address || '',
            },
            images: req.file ? [`/uploads/${req.file.filename}`] : [],
            updates: [{ message: 'Issue reported by citizen', by: 'system' }],
        })

        await issue.save()

        // Emit real-time event
        const io = req.app.get('io')
        io.emit('issue:created', issue)

        res.status(201).json(issue)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// PUT /api/issues/:id — Update an issue
router.put('/:id', async (req, res) => {
    try {
        const { status, assignedTo, updateMessage, resolvedImage } = req.body
        const update = {}
        if (status) update.status = status
        if (assignedTo) update.assignedTo = assignedTo
        if (resolvedImage) update.resolvedImage = resolvedImage

        const issue = await Issue.findByIdAndUpdate(
            req.params.id,
            {
                ...update,
                ...(updateMessage && {
                    $push: { updates: { message: updateMessage, by: req.body.updatedBy || 'authority' } }
                }),
            },
            { new: true }
        )

        if (!issue) return res.status(404).json({ error: 'Issue not found' })

        // Emit real-time event
        const io = req.app.get('io')
        if (status === 'resolved') {
            io.emit('issue:resolved', issue)
        } else {
            io.emit('issue:updated', issue)
        }

        res.json(issue)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router
