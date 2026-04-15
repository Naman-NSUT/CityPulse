import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import LiveTicker from '../components/LiveTicker'

export default function DashboardLayout() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-slate-950">
            {/* Background ambient glow */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-500/3 rounded-full blur-3xl" />
            </div>

            {/* Sidebar */}
            <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

            {/* Main content */}
            <main className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 relative z-10 ${sidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
                {/* Live Ticker */}
                <LiveTicker />

                {/* Page content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
