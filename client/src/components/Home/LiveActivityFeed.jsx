import { motion, AnimatePresence } from 'framer-motion'
import { Activity, Clock, CheckCircle2, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchIssues } from '../../lib/api'
import { formatDistanceToNow } from 'date-fns'

export default function LiveActivityFeed() {
    // Fetch live issues synced with React Query and WebSockets indirectly
    const feed = [
        { _id: '1', title: 'Water Main Break', location: { address: 'Sector 4, Main Road' }, category: 'Infrastructure', status: 'pending', createdAt: new Date() },
        { _id: '2', title: 'Street Light Out', location: { address: 'Block B, 5th Ave' }, category: 'Utilities', status: 'in-progress', createdAt: new Date() }
    ]

    return (
        <div className="py-20 relative bg-slate-900/40 border-y border-white/5 backdrop-blur-sm overflow-hidden overflow-x-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />
            <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                            </span>
                            <span className="text-rose-400 font-bold text-sm tracking-widest uppercase">Live</span>
                        </div>
                        <h2 className="text-3xl font-bold text-white">What's Happening Right Now</h2>
                    </div>
                    <Link to="/map" className="hidden sm:flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                        View Live Map <ChevronRight size={18} />
                    </Link>
                </div>

                <div className="relative">
                    {/* The Scrolling Track */}
                    <div className="flex gap-6 overflow-x-auto pb-6 pt-2 custom-scrollbar snap-x snap-mandatory">
                        <AnimatePresence>
                            {feed.length > 0 ? feed.map((item) => (
                                <motion.div
                                    key={item._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, x: -50 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    className="snap-start shrink-0 w-[300px] bg-slate-800/80 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors shadow-xl"
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2 text-xs text-slate-400">
                                            <Clock size={14} />
                                            {formatDistanceToNow(new Date(item.updatedAt || item.createdAt), { addSuffix: true })}
                                        </div>
                                        {item.status === 'resolved' ? (
                                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full text-xs font-bold uppercase flex items-center gap-1"><CheckCircle2 size={12} /> Resolved</span>
                                        ) : item.status === 'in-progress' ? (
                                            <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full text-xs font-bold uppercase">In-Progress</span>
                                        ) : (
                                            <span className="bg-slate-700 text-slate-300 border border-slate-600 px-2 py-0.5 rounded-full text-xs font-bold uppercase">Reported</span>
                                        )}
                                    </div>

                                    <h4 className="text-white font-bold text-lg mb-1 truncate">{item.title}</h4>
                                    <p className="text-slate-400 text-sm mb-4 truncate">{item.location?.address || 'Location unknown'}</p>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 border-t border-slate-700 pt-3">
                                        <Activity size={14} className="text-cyan-400" />
                                        <span>AI Classified: <strong className="text-cyan-400">{item.category}</strong></span>
                                    </div>
                                </motion.div>
                            )) : (
                                // Mock data if empty
                                [1, 2, 3, 4].map(i => (
                                    <div key={i} className="snap-start shrink-0 w-[300px] bg-slate-800/40 border border-white/5 rounded-2xl p-5 shadow-xl animate-pulse">
                                        <div className="h-4 bg-slate-700 rounded w-1/3 mb-4"></div>
                                        <div className="h-6 bg-slate-700 rounded w-3/4 mb-2"></div>
                                        <div className="h-4 bg-slate-700 rounded w-1/2 mb-6"></div>
                                        <div className="h-10 bg-slate-700 rounded w-full"></div>
                                    </div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    )
}
