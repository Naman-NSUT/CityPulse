import { cn } from '../lib/utils'

export default function StatusBadge({ status, size = 'sm' }) {
    const config = {
        pending: { label: 'Pending', dot: 'bg-amber-400', text: 'text-amber-400', bg: 'bg-amber-500/10' },
        'in-progress': { label: 'In Progress', dot: 'bg-cyan-400 animate-pulse', text: 'text-cyan-400', bg: 'bg-cyan-500/10' },
        resolved: { label: 'Resolved', dot: 'bg-emerald-400', text: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    }
    const c = config[status] || config.pending

    return (
        <span className={cn(
            'inline-flex items-center gap-1.5 rounded-full font-medium',
            c.bg, c.text,
            size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs'
        )}>
            <span className={cn('w-1.5 h-1.5 rounded-full', c.dot)} />
            {c.label}
        </span>
    )
}
