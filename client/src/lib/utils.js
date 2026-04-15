import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function formatTimeAgo(date) {
    const now = new Date()
    const diff = now - new Date(date)
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
}

export function getSeverityColor(severity) {
    switch (severity) {
        case 'critical': return 'rose'
        case 'high': return 'amber'
        case 'medium': return 'cyan'
        case 'low': return 'emerald'
        default: return 'cyan'
    }
}

export function getStatusColor(status) {
    switch (status) {
        case 'pending': return 'amber'
        case 'in-progress': return 'cyan'
        case 'resolved': return 'emerald'
        default: return 'slate'
    }
}

export function getCategoryIcon(category) {
    const map = {
        pothole: 'Construction',
        streetlight: 'Lightbulb',
        garbage: 'Trash2',
        water: 'Droplets',
        road: 'Route',
        noise: 'Volume2',
        graffiti: 'PaintBucket',
        other: 'AlertCircle',
    }
    return map[category] || 'AlertCircle'
}
