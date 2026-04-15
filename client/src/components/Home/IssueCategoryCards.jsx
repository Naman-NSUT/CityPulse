import { motion } from 'framer-motion'
import { ArrowRight, Zap, Target, Trash2, Droplets, Car } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { fetchCategories } from '../../lib/api'

export default function IssueCategoryCards() {
    const { data: realCategories } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
    })

    const categories = [
        { id: 1, name: 'Potholes & Roads', icon: Car, count: 342, bg: 'from-amber-400/20 to-orange-500/5', color: 'text-amber-400', border: 'hover:border-amber-500/50' },
        { id: 2, name: 'Street Lights', icon: Zap, count: 189, bg: 'from-yellow-400/20 to-amber-500/5', color: 'text-yellow-400', border: 'hover:border-yellow-500/50' },
        { id: 3, name: 'Water & Pipes', icon: Droplets, count: 67, bg: 'from-cyan-400/20 to-blue-500/5', color: 'text-cyan-400', border: 'hover:border-cyan-500/50' },
        { id: 4, name: 'Waste Mgmt', icon: Trash2, count: 234, bg: 'from-emerald-400/20 to-green-500/5', color: 'text-emerald-400', border: 'hover:border-emerald-500/50' },
        { id: 5, name: 'Graffiti/Vandalism', icon: Target, count: 45, bg: 'from-rose-400/20 to-pink-500/5', color: 'text-rose-400', border: 'hover:border-rose-500/50' },
    ]

    // Mix real DB counts if possible
    const mappedCategories = categories.map(cat => {
        if (Array.isArray(realCategories)) {
            const match = realCategories.find(c => c.name.toLowerCase().includes(cat.name.split(' ')[0].toLowerCase()))
            if (match) cat.count = match.value
        }
        return cat
    })

    return (
        <div className="py-20 relative bg-slate-900/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-bold text-white mb-4">Common Issues in Your Area</h2>
                        <p className="text-slate-400 text-lg">
                            The AI engine automatically classifies incoming reports into specific operational categories for immediate routing.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {mappedCategories.map((cat, i) => (
                        <motion.div
                            key={cat.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Link to={`/map?category=${cat.name}`} className={`block h-full bg-slate-900/60 backdrop-blur-md rounded-2xl p-6 border border-white/5 transition-all duration-300 group ${cat.border} hover:shadow-2xl hover:-translate-y-1`}>
                                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${cat.bg} flex items-center justify-center mb-6`}>
                                    <cat.icon className={cat.color} size={24} />
                                </div>

                                <h3 className="text-white font-bold text-lg mb-2">{cat.name}</h3>
                                <div className="flex justify-between items-center mt-6">
                                    <span className="text-slate-400 font-medium">{cat.count} open</span>
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-white" />
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
