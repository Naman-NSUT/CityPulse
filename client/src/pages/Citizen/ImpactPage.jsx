import { motion } from 'framer-motion'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { fetchTimeline, fetchCategories, fetchSectors } from '../../lib/api'

export default function ImpactPage() {
    const { data: timelineData = [] } = useQuery({ queryKey: ['timeline'], queryFn: fetchTimeline })
    const { data: catData = [] } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories })
    const { data: secData = [] } = useQuery({ queryKey: ['sectors'], queryFn: fetchSectors })

    const COLORS = ['#2dd4bf', '#818cf8', '#f472b6', '#fbbf24', '#34d399']

    return (
        <div className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <h1 className="text-3xl font-extrabold text-white mb-2">City Impact Analytics</h1>
            <p className="text-slate-400 mb-8">Public transparency dashboard tracking infrastructure resolution efficiency.</p>

            {/* Top Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Total Reports</p>
                    <p className="text-3xl font-extrabold text-white">10,247</p>
                    <p className="text-sm font-medium text-emerald-400 mt-2">↑ +234 (30d)</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Resolution Rate</p>
                    <p className="text-3xl font-extrabold text-white">96.2%</p>
                    <p className="text-sm font-medium text-emerald-400 mt-2">↑ +2.1%</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Avg Time</p>
                    <p className="text-3xl font-extrabold text-white">1.8h</p>
                    <p className="text-sm font-medium text-emerald-400 mt-2">↓ -0.3h (faster)</p>
                </div>
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl"></div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-2">Active Citizens</p>
                    <p className="text-3xl font-extrabold text-white">50,124</p>
                    <p className="text-sm font-medium text-emerald-400 mt-2">↑ +1.2k</p>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg mb-8">
                <h3 className="text-white font-bold mb-6">Issues Reported vs Resolved (30 Days)</h3>
                <div className="h-[300px] w-full">
                    {timelineData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={timelineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                                />
                                <Line type="monotone" dataKey="count" name="Reported" stroke="#2dd4bf" strokeWidth={3} dot={false} activeDot={{ r: 8 }} />
                                {/* Emulating resolved line below reported for demo visual */}
                                <Line type="monotone" dataKey="count" name="Resolved" stroke="#10b981" strokeWidth={3} strokeDasharray="5 5" dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <p className="text-slate-500">Loading historical metrics...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-white font-bold mb-6">AI Issue Classifications</h3>
                    <div className="h-[300px] w-full">
                        {catData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={catData}
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {catData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.05)" />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-slate-500">Loading category distribution...</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-slate-900/60 p-6 rounded-2xl border border-white/5 shadow-lg">
                    <h3 className="text-white font-bold mb-6">Top Geographic Sectors</h3>
                    <div className="h-[300px] w-full">
                        {secData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={secData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                                    <Bar dataKey="value" fill="#818cf8" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-slate-500">Loading hotspots...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
