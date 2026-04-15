import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { useState, useEffect } from 'react'
import { TrendingUp, Clock, MapPin, CheckCircle } from 'lucide-react'

function AnimatedNumber({ value, suffix, decimals = 0, inView }) {
    const [display, setDisplay] = useState(0)
    useEffect(() => {
        if (!inView) return
        let start = 0
        const duration = 2000
        const step = 16
        const increment = value / (duration / step)
        const timer = setInterval(() => {
            start += increment
            if (start >= value) { setDisplay(value); clearInterval(timer) }
            else setDisplay(start)
        }, step)
        return () => clearInterval(timer)
    }, [inView, value])
    return <span>{decimals > 0 ? display.toFixed(decimals) : Math.floor(display)}{suffix}</span>
}

export default function StatsDashboard() {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 })

    const stats = [
        { value: 342, suffix: '', label: 'Total Issues This Week', icon: TrendingUp, color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/20' },
        { value: 89.2, suffix: '%', label: 'Resolution Rate', icon: CheckCircle, color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20', decimals: 1 },
        { value: 1.8, suffix: 'h', label: 'Avg Response Time', icon: Clock, color: 'text-violet-400', bgColor: 'bg-violet-500/10', borderColor: 'border-violet-500/20', decimals: 1 },
        { value: 127, suffix: '', label: 'Active Cities', icon: MapPin, color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' }
    ]

    return (
        <section className="py-20 bg-slate-800/30" ref={ref}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-white mb-4">Live Impact Dashboard</h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">Real-time metrics showing our collective impact on urban infrastructure</p>
                </motion.div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon
                        return (
                            <motion.div key={index} initial={{ opacity: 0, scale: 0.9 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: index * 0.1 }}
                                className={`bg-slate-900/60 backdrop-blur-sm border ${stat.borderColor} rounded-2xl p-6 hover:border-white/20 transition-all duration-300`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${stat.color}`} />
                                    </div>
                                    <div className={`text-xs font-medium ${stat.color} bg-slate-800 px-2 py-1 rounded-lg`}>LIVE</div>
                                </div>
                                <div className="mb-2">
                                    <motion.div 
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={inView ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: index * 0.1 + 0.2 }}
                                        className={`text-3xl font-bold ${stat.color} flex items-baseline`}
                                    >
                                        <AnimatedNumber 
                                            value={stat.value} 
                                            suffix={stat.suffix} 
                                            decimals={stat.decimals || 0} 
                                            inView={inView} 
                                        />
                                    </motion.div>
                                </div>
                                <p className="text-slate-400 text-sm font-medium">{stat.label}</p>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}