import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'
import { motion } from 'framer-motion'

const COLORS = ['#8b5cf6', '#0ea5e9', '#10b981', '#f59e0b', '#f43f5e', '#64748b']

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900/90 backdrop-blur-md border border-white/10 p-3 rounded-xl shadow-xl flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                <span className="text-white font-medium capitalize">{payload[0].name}:</span>
                <span className="text-white font-bold">{payload[0].value}</span>
            </div>
        )
    }
    return null
}

export default function CategoryDistribution({ data }) {
    if (!data || data.length === 0) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="col-span-1 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
            <div className="mb-6">
                <h3 className="text-lg font-bold text-white">Category Distribution</h3>
                <p className="text-sm text-slate-400">AI classifications breakdown</p>
            </div>

            <div className="h-[260px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend
                            verticalAlign="bottom"
                            height={36}
                            formatter={(value) => <span className="text-slate-300 text-sm capitalize">{value}</span>}
                            iconType="circle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    )
}
