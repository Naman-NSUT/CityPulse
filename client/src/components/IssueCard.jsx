import { motion } from 'framer-motion'
import { cn, formatTimeAgo, getStatusColor, getSeverityColor } from '../lib/utils'
import { MapPin, Clock, User, ArrowRight, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'

const statusIcons = {
    pending: AlertTriangle,
    'in-progress': Loader2,
    resolved: CheckCircle2,
}

const statusLabels = {
    pending: 'Pending Review',
    'in-progress': 'In Progress',
    resolved: 'Resolved',
}

export default function IssueCard({ issue, index = 0 }) {
    const statusColor = getStatusColor(issue.status)
    const severityColor = getSeverityColor(issue.severity)
    const StatusIcon = statusIcons[issue.status] || AlertTriangle

    return (
        <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.21, 0.47, 0.32, 0.98] }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className={cn(
                'glass-card-hover p-5 cursor-pointer relative overflow-hidden',
                `status-${issue.status}`
            )}
        >
            {/* Top accent line */}
            <div className={cn(
                'absolute top-0 left-0 right-0 h-px',
                statusColor === 'amber' && 'bg-gradient-to-r from-transparent via-amber-400 to-transparent',
                statusColor === 'cyan' && 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent',
                statusColor === 'emerald' && 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent',
            )} />

            <div className="flex items-start justify-between mb-3">
                {/* Category badge */}
                <span className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider',
                    `bg-${severityColor}-500/10 text-${severityColor}-400`
                )}>
                    {issue.category}
                </span>

                {/* Status */}
                <div className={cn(
                    'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs',
                    `bg-${statusColor}-500/10 text-${statusColor}-400`
                )}>
                    <StatusIcon className={cn('w-3 h-3', issue.status === 'in-progress' && 'animate-spin')} />
                    <span className="font-medium">{statusLabels[issue.status]}</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-white font-semibold text-sm mb-2 line-clamp-1">
                {issue.title || `${issue.category} Issue Report`}
            </h3>

            {/* Description */}
            <p className="text-xs text-slate-400 mb-3 line-clamp-2">
                {issue.description || 'No description provided'}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
                {issue.location?.address && (
                    <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-[120px]">{issue.location.address}</span>
                    </div>
                )}
                <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatTimeAgo(issue.createdAt)}</span>
                </div>
            </div>

            {/* Confidence bar */}
            {issue.confidence && (
                <div className="mt-3 pt-3 border-t border-white/5">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider">AI Confidence</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{(issue.confidence * 100).toFixed(0)}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${issue.confidence * 100}%` }}
                            transition={{ duration: 1, delay: index * 0.08 + 0.3 }}
                            className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-full"
                        />
                    </div>
                </div>
            )}
        </motion.div>
    )
}
