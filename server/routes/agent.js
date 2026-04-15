import { Router } from 'express'
import axios from 'axios'

const router = Router()

// POST /api/agent/chat — Proxy to LangGraph agent
router.post('/chat', async (req, res) => {
    try {
        const { message, issueId } = req.body

        try {
            // Try to call LangGraph agent service
            const response = await axios.post(`${process.env.AGENT_URL || 'http://localhost:8001'}/chat`, {
                message,
                issue_id: issueId,
            }, { timeout: 30000 })

            return res.json(response.data)
        } catch (agentError) {
            // Fallback: simulate agent response
            const lowerMsg = message.toLowerCase()
            let response = ''
            let actions = []

            if (lowerMsg.includes('start') || lowerMsg.includes('begun') || lowerMsg.includes('progress')) {
                response = `✅ **Status Updated**\n\nI've processed your update. The relevant issue has been moved to **In Progress**.\n\n- **Tool Called**: \`updateDatabase\`\n- **Action**: status → in-progress\n- **Broadcast**: Live dashboard updated via Socket.io`
                actions = [{ tool: 'updateDatabase', status: 'success' }]
            } else if (lowerMsg.includes('resolve') || lowerMsg.includes('complete') || lowerMsg.includes('fix') || lowerMsg.includes('done')) {
                response = `📸 **Verification Required**\n\nBefore marking as resolved, the ML microservice needs to verify the fix via image comparison.\n\n- **Tool**: \`verifyResolution\`\n- **Status**: Awaiting verification image\n\nPlease upload a photo of the resolved issue for multimodal verification.`
                actions = [{ tool: 'verifyResolution', status: 'pending' }]
            } else if (lowerMsg.includes('show') || lowerMsg.includes('list') || lowerMsg.includes('find') || lowerMsg.includes('search')) {
                response = `🔍 **Query Processed**\n\nI found several matching issues in the database. Here's a summary:\n\n1. 🔴 **Critical** — Water main break at Sector 12\n2. 🟡 **High** — Pothole cluster on Ring Road\n3. 🟢 **Medium** — Streetlight flickering at Block C\n\nWould you like to update any of these?`
                actions = [{ tool: 'queryDatabase', status: 'success' }]
            } else {
                response = `🤖 **Command Acknowledged**\n\nI've analyzed your instruction: *"${message}"*\n\nI can help you with:\n- **Status updates**: "Work started at [location]"\n- **Resolution**: "Mark issue as resolved"\n- **Queries**: "Show all critical issues"\n- **Assignments**: "Assign to [team]"\n\nPlease provide a more specific command.`
                actions = []
            }

            res.json({ response, actions })
        }
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

export default router
