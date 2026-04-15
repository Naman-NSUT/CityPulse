import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Clock, MapPin, Activity } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

export default function ActivityFeed({ issues }) {
    if (!issues || issues.length === 0) return null

    // Sort and take latest 5 for the feed
    const feed = [...issues].sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5)

    const getStatusIcon = (status) => {
        switch (status) {
            case 'resolved': return <CheckCircle2 size={16} className="text-emerald-400" />
            case 'in-progress': return <Clock size={16} className="text-amber-400" />
            default: return <AlertCircle size={16} className="text-rose-400" />
        }
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'resolved': return 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30'
            case 'in-progress': return 'bg-amber-400/20 text-amber-300 border-amber-400/30'
            default: return 'bg-rose-400/20 text-rose-300 border-rose-400/30'
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="col-span-1 lg:col-span-1 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 overflow-hidden flex flex-col h-[400px]"
        >
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Activity className="text-cyan-400" size={20} />
                    <h3 className="text-lg font-bold text-white">Live Activity Feed</h3>
                </div>
                <div className="flex items-center gap-2">
                    <span className="animate-pulse w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-xs text-slate-400 font-medium tracking-wide">SYNCED</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-4">
                    <AnimatePresence>
                        {feed.map((item, idx) => (
                            <motion.div
                                key={item._id + (item.updatedAt || item.createdAt)}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                exit={{ opacity: 0, x: 20, height: 0 }}
                                className="relative pl-6 pb-4 border-l border-slate-700 last:border-0 last:pb-0"
                            >
                                <div className="absolute -left-[9px] top-1 bg-slate-900 rounded-full p-0.5">
                                    {getStatusIcon(item.status)}
                                </div>

                                <div className="bg-slate-800/50 p-3 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(item.status)}`}>
                                            {item.status}
                                        </span>
                                        <span className="text-xs text-slate-500">
                                            {formatDistanceToNow(new Date(item.updatedAt || item.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-200 font-medium mt-2 line-clamp-1">{item.title}</p>
                                    <div className="flex items-center gap-1 mt-2 text-slate-400 text-xs">
                                        <MapPin size={12} />
                                        <span className="truncate">{item.location?.address || 'Unknown location'}</span>
                                    </div>
                                    {item.updates && item.updates.length > 0 && (
                                        <div className="mt-2 text-xs text-slate-400 italic border-l-2 border-slate-700 pl-2">
                                            "{item.updates[item.updates.length - 1].message}"
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    )
}
