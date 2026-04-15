import { useSocket } from '../lib/socket'
import { Activity, ArrowRight } from 'lucide-react'
import { formatTimeAgo } from '../lib/utils'

export default function LiveTicker() {
    const { activities, connected } = useSocket()

    // Placeholder activities if none received yet
    const displayActivities = activities.length > 0 ? activities : [
        { id: 1, message: 'System online — monitoring city infrastructure', type: 'info', timestamp: new Date() },
        { id: 2, message: 'AI classification engine active', type: 'info', timestamp: new Date() },
        { id: 3, message: 'Awaiting new reports...', type: 'info', timestamp: new Date() },
    ]

    const getTypeColor = (type) => {
        switch (type) {
            case 'created': return 'text-amber-400'
            case 'updated': return 'text-cyan-400'
            case 'resolved': return 'text-emerald-400'
            default: return 'text-slate-500'
        }
    }

    return (
        <div className="relative h-10 bg-slate-900/80 border-b border-white/5 flex items-center overflow-hidden">
            {/* Label */}
            <div className="flex items-center gap-2 px-4 border-r border-white/5 h-full flex-shrink-0 z-10 bg-slate-900/80">
                <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Live</span>
            </div>

            {/* Scrolling ticker */}
            <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-8 animate-ticker whitespace-nowrap px-4">
                    {[...displayActivities, ...displayActivities].map((item, i) => (
                        <div key={`${item.id}-${i}`} className="flex items-center gap-2 flex-shrink-0">
                            <span className={`text-xs ${getTypeColor(item.type)}`}>●</span>
                            <span className="text-xs text-slate-400">{item.message}</span>
                            <span className="text-[10px] text-slate-600">{formatTimeAgo(item.timestamp)}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Connection indicator */}
            <div className="flex items-center gap-1.5 px-4 flex-shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-[10px] text-slate-500">{connected ? 'LIVE' : 'OFFLINE'}</span>
            </div>
        </div>
    )
}
