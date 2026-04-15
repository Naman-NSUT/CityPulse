import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { MapPin, Clock, AlertTriangle, CheckCircle } from 'lucide-react'

export default function RecentActivity() {
    const activities = [
        {
            id: '1',
            category: 'pothole',
            title: 'Large pothole on Main Street',
            location: 'Sector 12, Downtown',
            time: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
            status: 'pending',
            severity: 'high',
            confidence: 94
        },
        {
            id: '2',
            category: 'garbage',
            title: 'Overflowing public bins',
            location: 'City Center Park',
            time: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
            status: 'in-progress',
            severity: 'medium',
            confidence: 87
        },
        {
            id: '3',
            category: 'fallen_tree',
            title: 'Tree blocking sidewalk',
            location: 'Oak Avenue',
            time: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            status: 'resolved',
            severity: 'critical',
            confidence: 99
        },
        {
            id: '4',
            category: 'graffiti',
            title: 'Vandalism on public wall',
            location: 'Marina District',
            time: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
            status: 'pending',
            severity: 'low',
            confidence: 91
        },
        {
            id: '5',
            category: 'electrical_pole',
            title: 'Damaged electrical pole',
            location: 'Industrial Zone',
            time: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
            status: 'in-progress',
            severity: 'high',
            confidence: 96
        }
    ]

    const getCategoryInfo = (category) => {
        const categories = {
            pothole: { color: 'bg-amber-500', label: 'Pothole' },
            garbage: { color: 'bg-green-500', label: 'Garbage' },
            fallen_tree: { color: 'bg-emerald-500', label: 'Fallen Tree' },
            graffiti: { color: 'bg-violet-500', label: 'Graffiti' },
            electrical_pole: { color: 'bg-red-500', label: 'Electrical' }
        }
        return categories[category] || { color: 'bg-gray-500', label: category }
    }

    const getStatusInfo = (status) => {
        const statuses = {
            pending: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', icon: Clock, label: 'Under Review' },
            'in-progress': { color: 'text-blue-400', bg: 'bg-blue-400/10', icon: AlertTriangle, label: 'In Progress' },
            resolved: { color: 'text-green-400', bg: 'bg-green-400/10', icon: CheckCircle, label: 'Resolved' }
        }
        return statuses[status] || statuses.pending
    }

    const getSeverityInfo = (severity) => {
        const severities = {
            low: { color: 'text-green-400', bg: 'bg-green-400/10' },
            medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
            high: { color: 'text-orange-400', bg: 'bg-orange-400/10' },
            critical: { color: 'text-red-400', bg: 'bg-red-400/10' }
        }
        return severities[severity] || severities.medium
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
        <section className="py-20 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Recent Activity Feed
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Latest issues reported by citizens in your community
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activities.map((activity, index) => {
                        const categoryInfo = getCategoryInfo(activity.category)
                        const statusInfo = getStatusInfo(activity.status)
                        const severityInfo = getSeverityInfo(activity.severity)
                        const StatusIcon = statusInfo.icon

                        return (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-300"
                            >
                                {/* Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center`}>
                                            <span className="text-white font-bold text-sm">
                                                {categoryInfo.label.charAt(0)}
                                            </span>
                                        </div>
                                        <div>
                                            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${severityInfo.bg} ${severityInfo.color} mb-1`}>
                                                {activity.severity.toUpperCase()}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-white font-medium text-sm">
                                                    AI: {categoryInfo.label}
                                                </span>
                                                <span className="text-slate-500 text-xs">
                                                    {activity.confidence}% confidence
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <h3 className="text-white font-semibold mb-2 line-clamp-2">
                                    {activity.title}
                                </h3>

                                <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                                    <MapPin className="w-4 h-4" />
                                    <span className="line-clamp-1">{activity.location}</span>
                                </div>

                                {/* Footer */}
                                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                    <div className="flex items-center gap-2">
                                        <StatusIcon className={`w-4 h-4 ${statusInfo.color}`} />
                                        <span className={`text-xs font-medium ${statusInfo.color}`}>
                                            {statusInfo.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-500 text-xs">
                                        <Clock className="w-3 h-3" />
                                        {formatRelativeTime(activity.time)}
                                    </div>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-12">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 px-8 py-3 rounded-full font-bold text-sm shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
                    >
                        View All Live Incidents
                    </motion.button>
                </div>
            </div>
        </section>
    )
}
