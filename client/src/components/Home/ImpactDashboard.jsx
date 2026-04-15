import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, Clock } from 'lucide-react'
import CountUp from 'react-countup'
import { useQuery } from '@tanstack/react-query'
import { fetchStats } from '../../lib/api'

export default function ImpactDashboard() {
    const { data: stats } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStats,
    })

    // Fallback data if API returns empty
    const total = stats?.total || 10247
    const resolved = stats?.resolved || 9824
    const pending = stats?.pending || 33

    return (
        <div className="py-24 relative overflow-hidden bg-[#070b14]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl tracking-tight mb-4">
                        City Health Score: <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">87/100</span>
                    </h2>
                    <p className="text-lg text-slate-400">
                        A real-time snapshot of our infrastructure management efficiency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 bg-cyan-500/10 text-cyan-400 rounded-xl flex items-center justify-center mb-6">
                            <TrendingUp size={24} />
                        </div>
                        <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Reports</h4>
                        <div className="text-4xl font-bold text-white mb-2">
                            <CountUp end={total} duration={2.5} separator="," />
                        </div>
                        <p className="text-sm text-emerald-400 flex items-center gap-1">↑ +234 this week</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-xl flex items-center justify-center mb-6">
                            <CheckCircle size={24} />
                        </div>
                        <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Resolved</h4>
                        <div className="text-4xl font-bold text-white mb-2">
                            <CountUp end={resolved} duration={2.5} separator="," />
                        </div>
                        <p className="text-sm text-emerald-400 flex items-center gap-1">↑ 96% success rate</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl"
                    >
                        <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Active / Pending</h4>
                        <div className="text-4xl font-bold text-white mb-2">
                            <CountUp end={pending} duration={2.5} />
                        </div>
                        <p className="text-sm text-emerald-400 flex items-center gap-1">↓ -12% vs last month</p>
                    </motion.div>

                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-slate-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-3xl rounded-full"></div>
                        <div className="w-12 h-12 bg-violet-500/10 text-violet-400 rounded-xl flex items-center justify-center mb-6">
                            <Clock size={24} />
                        </div>
                        <h4 className="text-slate-400 text-sm font-semibold uppercase tracking-wider mb-2">Avg Response</h4>
                        <div className="text-4xl font-bold text-white mb-2 flex items-baseline gap-1">
                            <CountUp end={1} duration={2} />.<CountUp end={8} duration={2} />
                            <span className="text-xl text-slate-500 font-medium">hrs</span>
                        </div>
                        <div className="w-full bg-slate-800 rounded-full h-1.5 mt-4">
                            <div className="bg-gradient-to-r from-violet-500 to-cyan-400 h-1.5 rounded-full w-[85%]"></div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
