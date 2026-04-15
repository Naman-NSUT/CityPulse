import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Camera, MapPin, X } from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function FloatingActionButton() {
    const [isOpen, setIsOpen] = useState(false)
    const location = useLocation()

    // Don't show FAB on the report page itself
    if (location.pathname === '/report') return null

    return (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.8 }}
                        className="flex flex-col gap-3 mb-4"
                    >
                        <Link
                            to="/report"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 bg-slate-800 text-white px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg hover:bg-slate-700 transition-colors group"
                        >
                            <span className="text-sm font-medium pr-2">Capture Issue</span>
                            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors">
                                <Camera size={16} />
                            </div>
                        </Link>

                        <Link
                            to="/map"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 bg-slate-800 text-white px-4 py-2.5 rounded-2xl border border-white/10 shadow-lg hover:bg-slate-700 transition-colors group"
                        >
                            <span className="text-sm font-medium pr-2">Drop Pin</span>
                            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors">
                                <MapPin size={16} />
                            </div>
                        </Link>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-14 h-14 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center transition-colors text-slate-900 ${isOpen ? 'bg-rose-500 hover:bg-rose-400' : 'bg-cyan-500 hover:bg-cyan-400'
                    }`}
            >
                {isOpen ? <X size={24} className="text-white" /> : <Plus size={28} />}
            </motion.button>
        </div>
    )
}
