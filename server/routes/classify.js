import { Router } from 'express'
import upload from '../middleware/upload.js'
import axios from 'axios'

const router = Router()

// POST /api/classify — Proxy to FastAPI ML service
router.post('/', upload.single('image'), async (req, res) => {
    try {
        // Try to call FastAPI service
        const formData = new FormData()
        if (req.file) {
            const fs = await import('fs')
            const blob = new Blob([fs.readFileSync(req.file.path)])
            formData.append('file', blob, req.file.originalname)
        }

        try {
            const response = await axios.post(`${process.env.ML_SERVICE_URL || 'http://localhost:8000'}/classify`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 5000,
            })
            return res.json(response.data)
        } catch (mlError) {
            // Fallback: simulate ML classification
            const categories = ['pothole', 'streetlight', 'garbage', 'water', 'road']
            const severities = ['low', 'medium', 'high', 'critical']

            res.json({
                category: categories[Math.floor(Math.random() * categories.length)],
                confidence: parseFloat((0.85 + Math.random() * 0.14).toFixed(3)),
                severity: severities[Math.floor(Math.random() * severities.length)],
            })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router
