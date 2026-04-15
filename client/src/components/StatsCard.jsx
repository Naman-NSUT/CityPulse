import { motion } from 'framer-motion'
import { cn, getStatusColor } from '../lib/utils'

const glowMap = {
    amber: 'glow-border-amber',
    cyan: 'glow-border-cyan',
    emerald: 'glow-border-emerald',
    rose: 'glow-border-rose',
    violet: 'glow-border-violet',
}

const bgMap = {
    amber: 'from-amber-500/10 to-transparent',
    cyan: 'from-cyan-500/10 to-transparent',
    emerald: 'from-emerald-500/10 to-transparent',
    rose: 'from-rose-500/10 to-transparent',
    violet: 'from-violet-500/10 to-transparent',
}

export default function StatsCard({ title, value, subtitle, icon: Icon, color = 'cyan', delay = 0, span = 1 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                'glass-card p-5 relative overflow-hidden group',
                glowMap[color],
                span === 2 && 'col-span-2'
            )}
        >
            {/* Background gradient */}
            <div className={cn('absolute inset-0 bg-gradient-to-br opacity-50', bgMap[color])} />

            <div className="relative z-10 flex items-start justify-between">
                <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">{title}</p>
                    <p className="text-3xl font-bold tracking-tight text-white">{value}</p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
                    )}
                </div>
                {Icon && (
                    <div className={cn(
                        'w-10 h-10 rounded-xl flex items-center justify-center',
                        `bg-${color}-500/10`
                    )}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                    </div>
                )}
            </div>
        </motion.div>
    )
}
