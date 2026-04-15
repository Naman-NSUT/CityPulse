import { motion } from 'framer-motion'
import { AlertCircle, Clock, CheckCircle2, FileText, ArrowUpRight } from 'lucide-react'

// Custom animated counter component (fallback to standard if framer-motion is complex for simple numbers)
export default function StatsCards({ stats }) {
    if (!stats) return null

    const cards = [
        {
            title: 'Total Reports',
            value: stats.total,
            icon: FileText,
            color: 'text-violet-400',
            bg: 'bg-violet-400/10',
            trend: '+12% this week',
            trendColor: 'text-emerald-400'
        },
        {
            title: 'Pending Review',
            value: stats.pending,
            icon: AlertCircle,
            color: 'text-rose-400',
            bg: 'bg-rose-400/10',
            trend: 'Requires action',
            trendColor: 'text-rose-400'
        },
        {
            title: 'In Progress',
            value: stats.inProgress,
            icon: Clock,
            color: 'text-amber-400',
            bg: 'bg-amber-400/10',
            trend: 'Active teams',
            trendColor: 'text-amber-400'
        },
        {
            title: 'Resolved',
            value: stats.resolved,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-400/10',
            trend: '+5 today',
            trendColor: 'text-emerald-400'
        },
    ]

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card, i) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="group relative bg-slate-900/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl hover:border-white/20 transition-all overflow-hidden"
                >
                    {/* Background glow decoration */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 ${card.bg} rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity`} />

                    <div className="flex justify-between items-start mb-4">
                        <div className={`p-3 rounded-lg ${card.bg} ${card.color}`}>
                            <card.icon size={20} />
                        </div>
                        <span className={`text-xs font-medium ${card.trendColor} flex items-center gap-1`}>
                            {card.trend.includes('+') && <ArrowUpRight size={14} />}
                            {card.trend}
                        </span>
                    </div>

                    <div>
                        <h3 className="text-4xl font-bold text-white mb-1 tracking-tight">
                            {card.value}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium">{card.title}</p>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}
