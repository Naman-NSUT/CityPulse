import axios from 'axios'

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

// Issues API
export const fetchIssues = async (params = {}) => {
    const { data } = await api.get('/issues', { params })
    return data
}

export const fetchIssue = async (id) => {
    const { data } = await api.get(`/issues/${id}`)
    return data
}

export const createIssue = async (formData) => {
    const { data } = await api.post('/issues', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}

export const updateIssue = async ({ id, ...updates }) => {
    const { data } = await api.put(`/issues/${id}`, updates)
    return data
}

// ML Classification
export const classifyImage = async (formData) => {
    const { data } = await api.post('/classify', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
}

// Agent Chat
export const sendChatMessage = async ({ message, issueId }) => {
    const { data } = await api.post('/agent/chat', { message, issueId })
    return data
}

// Stats
export const fetchStats = async () => {
    const { data } = await api.get('/issues/stats/overview')
    return data
}

export const fetchTimeline = async (days = 30) => {
    const { data } = await api.get(`/issues/timeline?days=${days}`)
    return data
}

export const fetchCategories = async () => {
    const { data } = await api.get('/issues/categories')
    return data
}

export const fetchSectors = async () => {
    const { data } = await api.get('/issues/sectors')
    return data
}

export default api
