import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { fetchIssues, fetchStats, fetchTimeline, fetchCategories } from '../lib/api'

import StatsCards from '../components/dashboard/StatsCards'
import TimelineChart from '../components/dashboard/TimelineChart'
import CategoryDistribution from '../components/dashboard/CategoryDistribution'
import ActivityFeed from '../components/dashboard/ActivityFeed'
import EmptyState from '../components/dashboard/EmptyState'

export default function DashboardPage() {
    const { data: issues = [], isLoading: isLoadingIssues } = useQuery({
        queryKey: ['issues'],
        queryFn: () => fetchIssues(),
        refetchInterval: 5000, // Sync fast for the activity feed
    })

    const { data: stats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['stats'],
        queryFn: fetchStats,
        refetchInterval: 10000,
    })

    const { data: timelineData } = useQuery({
        queryKey: ['timeline'],
        queryFn: () => fetchTimeline(30),
        refetchInterval: 60000,
    })

    const { data: categoryData } = useQuery({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        refetchInterval: 60000,
    })

    // If fully loaded and absolutely no issues exist
    if (!isLoadingIssues && issues.length === 0) {
        return <EmptyState />
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header with Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
                <div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Command Center</h1>
                    <p className="text-sm text-slate-400 mt-1">Real-time infrastructure analytics and monitoring</p>
                </div>

                <div className="flex gap-3">
                    <button onClick={() => window.location.href = '/'} className="glass-button text-sm font-medium px-4 py-2 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors">
                        Simulate Report
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-sm text-emerald-400 font-bold">LIVE SYNC</span>
                    </div>
                </div>
            </motion.div>

            {/* Top Level KPIs */}
            {isLoadingStats ? (
                <div className="h-32 w-full glass-card flex items-center justify-center">
                    <Loader2 className="animate-spin text-emerald-500" />
                </div>
            ) : (
                <StatsCards stats={stats} />
            )}

            {/* Main Analytical Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Timeline (Spans 2 cols) */}
                <TimelineChart data={timelineData} />

                {/* Right Column: Categories */}
                <CategoryDistribution data={categoryData} />

            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Activity Feed */}
                <ActivityFeed issues={issues} />

                {/* Secondary data component could go here, for now expand activity feed or leave empty */}
                <div className="col-span-1 lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                    <h3 className="text-lg font-bold text-white mb-2">Awaiting Geographic Heatmap</h3>
                    <p className="text-slate-400 text-sm max-w-sm">
                        The Leaflet geospatial block is modularized. For now, view the global impact map via the sidebar route.
                    </p>
                    <button onClick={() => window.location.href = '/map'} className="mt-4 glass-button text-xs font-medium px-4 py-2">
                        Open Full Map
                    </button>
                </div>

            </div>
        </div>
    )
}
