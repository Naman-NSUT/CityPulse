import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    LayoutDashboard,
    MessageSquare,
    Map,
    Activity,
    Settings,
    ChevronLeft,
    ChevronRight,
    Radio,
    Zap,
} from 'lucide-react'
import { useSocket } from '../lib/socket'

const navItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/chat', icon: MessageSquare, label: 'Command Chat' },
    { to: '/map', icon: Map, label: 'Impact Map' },
]

export default function Sidebar({ collapsed, onToggle }) {
    const { connected } = useSocket()
    const location = useLocation()

    return (
        <motion.aside
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className={`fixed top-0 left-0 h-full z-50 glass-sidebar flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="flex items-center gap-3 px-5 py-6 border-b border-white/5">
                <div className="relative">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-glow-sm">
                        <Zap className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                    </div>
                    <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                </div>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                    >
                        <h1 className="text-lg font-bold tracking-tight text-gradient-brand">CityPulse</h1>
                        <p className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">Command Center</p>
                    </motion.div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.to
                    return (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${isActive
                                    ? 'bg-white/10 text-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-cyan-400"
                                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                />
                            )}
                            <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'group-hover:text-white'}`} />
                            {!collapsed && (
                                <span className="text-sm font-medium">{item.label}</span>
                            )}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Status footer */}
            <div className="px-3 py-4 border-t border-white/5">
                {/* Connection status */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${connected ? 'text-emerald-400' : 'text-rose-400'}`}>
                    <Radio className="w-4 h-4" />
                    {!collapsed && (
                        <span className="text-xs font-medium">
                            {connected ? 'Live Connected' : 'Disconnected'}
                        </span>
                    )}
                </div>

                {/* Collapse toggle */}
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-full mt-2 py-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
                >
                    {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </button>
            </div>
        </motion.aside>
    )
}
