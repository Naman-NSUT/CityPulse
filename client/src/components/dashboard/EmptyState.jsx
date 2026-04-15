import { motion } from 'framer-motion'
import { ShieldCheck, Zap, Server, ActivitySquare } from 'lucide-react'

export default function EmptyState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full flex flex-col items-center justify-center p-8 text-center min-h-[60vh]"
        >
            <motion.div
                animate={{
                    y: [0, -10, 0],
                    boxShadow: ['0 0 0 rgba(16, 185, 129, 0)', '0 20px 40px rgba(16, 185, 129, 0.2)', '0 0 0 rgba(16, 185, 129, 0)']
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="w-32 h-32 bg-emerald-400/10 rounded-full flex items-center justify-center mb-8 border border-emerald-400/20 relative"
            >
                <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse"></div>
                <ShieldCheck size={64} className="text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)] z-10" />
            </motion.div>

            <h2 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4 tracking-tight">
                City Operations Nominal
            </h2>
            <p className="text-slate-400 max-w-lg mb-12 text-lg">
                127 hours incident-free. All infrastructure anomalies have been routed, cleared, and verified by the active ML-Agent.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl">
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex flex-col items-center">
                    <Zap className="text-yellow-400 mb-3" size={24} />
                    <span className="text-2xl font-bold text-white">^34%</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Resolution Speed</span>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex flex-col items-center">
                    <ActivitySquare className="text-cyan-400 mb-3" size={24} />
                    <span className="text-2xl font-bold text-white">0</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Pending Alerts</span>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm border border-white/5 p-6 rounded-2xl flex flex-col items-center">
                    <Server className="text-violet-400 mb-3" size={24} />
                    <span className="text-2xl font-bold text-white">99.9%</span>
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">System Uptime</span>
                </div>
            </div>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-12 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium flex items-center gap-2 transition-colors"
                onClick={() => window.location.href = "/"}
            >
                Submit Synthetic Scenario
            </motion.button>
        </motion.div>
    )
}
