import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { MapPin, Clock, AlertTriangle } from 'lucide-react'

export default function RecentNearbyReports() {
    const nearbyReports = [
        {
            id: '1',
            category: 'pothole',
            title: 'Large pothole on Main Street',
            location: '2 blocks away',
            time: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
            severity: 'high',
            status: 'pending'
        },
        {
            id: '2',
            category: 'garbage',
            title: 'Overflowing public bins',
            location: '0.5 miles away',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            severity: 'medium',
            status: 'in-progress'
        },
        {
            id: '3',
            category: 'streetlight',
            title: 'Broken streetlight',
            location: '1 block away',
            time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            severity: 'medium',
            status: 'resolved'
        }
    ]

    const getCategoryInfo = (category) => {
        const categories = {
            pothole: { color: 'bg-amber-500', label: 'Pothole', icon: '🕳️' },
            garbage: { color: 'bg-green-500', label: 'Garbage', icon: '🗑️' },
            streetlight: { color: 'bg-yellow-500', label: 'Streetlight', icon: '💡' },
            fallen_tree: { color: 'bg-emerald-500', label: 'Fallen Tree', icon: '🌳' },
            graffiti: { color: 'bg-violet-500', label: 'Graffiti', icon: '🎨' }
        }
        return categories[category] || { color: 'bg-gray-500', label: category, icon: '📷' }
    }

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'text-green-400',
            medium: 'text-yellow-400',
            high: 'text-orange-400',
            critical: 'text-red-400'
        }
        return colors[severity] || colors.medium
    }

    const getStatusColor = (status) => {
        const colors = {
            pending: 'text-yellow-400',
            'in-progress': 'text-blue-400',
            resolved: 'text-green-400'
        }
        return colors[status] || colors.pending
    }

    const formatRelativeTime = (date) => {
        const now = new Date()
        const diffInMinutes = Math.floor((now - date) / (1000 * 60))
        
        if (diffInMinutes < 60) {
            return `${diffInMinutes}m ago`
        } else if (diffInMinutes < 1440) {
            return `${Math.floor(diffInMinutes / 60)}h ago`
        } else {
            return `${Math.floor(diffInMinutes / 1440)}d ago`
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">Recently Reported Near You</h3>
            </div>

            <div className="space-y-3">
                {nearbyReports.map((report, index) => {
                    const categoryInfo = getCategoryInfo(report.category)
                    
                    return (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all duration-300"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 ${categoryInfo.color} rounded-lg flex items-center justify-center text-sm`}>
                                        {categoryInfo.icon}
                                    </div>
                                    <div>
                                        <span className="text-white font-medium text-sm capitalize">
                                            {categoryInfo.label}
                                        </span>
                                        <div className={`text-xs ${getSeverityColor(report.severity)} flex items-center gap-1`}>
                                            <AlertTriangle className="w-3 h-3" />
                                            {report.severity}
                                        </div>
                                    </div>
                                </div>
                                <span className={`text-xs font-medium ${getStatusColor(report.status)}`}>
                                    {report.status.replace('-', ' ')}
                                </span>
                            </div>

                            {/* Content */}
                            <h4 className="text-white text-sm font-medium mb-2 line-clamp-1">
                                {report.title}
                            </h4>

                            {/* Footer */}
                            <div className="flex items-center justify-between text-xs text-slate-400">
                                <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {report.location}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {formatRelativeTime(report.time)}
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            <div className="text-center pt-4">
                <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium transition-colors">
                    View all nearby reports →
                </button>
            </div>
        </div>
    )
}
