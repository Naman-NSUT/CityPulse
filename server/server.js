import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import issueRoutes from './routes/issues.js'
import classifyRoutes from './routes/classify.js'
import agentRoutes from './routes/agent.js'

dotenv.config({ path: '../.env' })

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: ['http://localhost:5173', 'http://localhost:3000'],
        methods: ['GET', 'POST'],
    },
})

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/uploads', express.static('uploads'))

// Make io accessible to routes
app.set('io', io)

// Routes
app.use('/api/issues', issueRoutes)
app.use('/api/classify', classifyRoutes)
app.use('/api/agent', agentRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Socket.io connection
io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`)
    socket.on('disconnect', () => {
        console.log(`[Socket] Client disconnected: ${socket.id}`)
    })
})

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/citypulse'
mongoose.connect(MONGO_URI)
    .then(() => console.log('[DB] Connected to MongoDB'))
    .catch(err => console.error('[DB] MongoDB connection error:', err))

// Start server
const PORT = process.env.PORT || 5000
httpServer.listen(PORT, () => {
    console.log(`[Server] CityPulse API running on port ${PORT}`)
})

export { io }
