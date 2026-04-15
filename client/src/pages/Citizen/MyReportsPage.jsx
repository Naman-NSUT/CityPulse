import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { fetchIssues } from '../../lib/api'
import { CheckCircle2, Clock, Check, Activity, AlertCircle, PlusCircle, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function MyReportsPage() {
    const [tab, setTab] = useState('all') // all | pending | in-progress | resolved
    const [selectedIssue, setSelectedIssue] = useState(null)
    const { data: issues = [], isLoading } = useQuery({
        queryKey: ['issues'],
        queryFn: () => fetchIssues(),
    })

    // Mocking "My" reports by taking a random 10 for demonstration (so it looks like a user history)
    const myReports = issues.slice(0, 12)
    const filteredReports = tab === 'all' ? myReports : myReports.filter(r => r.status === tab)

    // Calculate stats
    const stats = {
        total: myReports.length,
        pending: myReports.filter(r => r.status === 'pending').length,
        inProgress: myReports.filter(r => r.status === 'in-progress').length,
        resolved: myReports.filter(r => r.status === 'resolved').length,
        impactScore: Math.round((myReports.filter(r => r.status === 'resolved').length / myReports.length) * 100) || 0
    }

    return (
        <div className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-white mb-2">
                        My Reports{' '}
                        <span className="text-slate-500 font-medium ml-2 text-lg">({myReports.length})</span>
                    </h1>
                    <p className="text-slate-400">Track and monitor the operational tickets you have submitted to City authorities.</p>
                </div>

                <Link
                    to="/report"
                    className="shrink-0 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all"
                >
                    <PlusCircle size={18} /> New Report
                </Link>
            </div>

            {/* Summary Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Activity className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs text-slate-500 font-medium">TOTAL</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
                    <p className="text-xs text-slate-400">Reports Submitted</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-5 h-5 text-yellow-400" />
                        <span className="text-xs text-slate-500 font-medium">ACTIVE</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.pending}</div>
                    <p className="text-xs text-slate-400">Under Review</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span className="text-xs text-slate-500 font-medium">DONE</span>
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">{stats.resolved}</div>
                    <p className="text-xs text-slate-400">Resolved</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Award className="w-5 h-5 text-cyan-400" />
                        <span className="text-xs text-slate-500 font-medium">SCORE</span>
                    </div>
                    <div className="text-2xl font-bold text-cyan-400 mb-1">{stats.impactScore}%</div>
                    <p className="text-xs text-slate-400">Impact Score</p>
                </motion.div>
            </div>

            {/* Filter Tabs */}
            <div className="flex bg-slate-900/60 p-1.5 rounded-xl border border-white/5 w-fit mb-8 shadow-sm">
                {[
                    { id: 'all', label: 'All History' },
                    { id: 'pending', label: 'Under Review' },
                    { id: 'in-progress', label: 'In-Progress Actions' },
                    { id: 'resolved', label: 'Resolved Tickets' }
                ].map(t => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`px-5 py-2 text-sm font-medium rounded-lg transition-all ${
                            tab === t.id
                                ? 'bg-slate-800 text-cyan-400 shadow-[0_4px_10px_rgba(0,0,0,0.2)]'
                                : 'text-slate-400 hover:text-white'
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Report Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence>
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="bg-slate-900/40 rounded-2xl border border-white/5 h-64 animate-pulse p-6" />
                        ))
                    ) : filteredReports.length > 0 ? (
                        filteredReports.map((report) => {
                            const dateMatch = report.createdAt ? new Date(report.createdAt) : new Date()
                            const formattedDate = format(dateMatch, 'MMM dd, yyyy • h:mm a')

                            return (
                                <motion.div
                                    key={report._id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                    className="bg-slate-900/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-white/10 transition-colors shadow-xl"
                                >
                                    {/* Card Thumbnail */}
                                    <div className="h-32 bg-slate-800 relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10" />
                                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=500&h=300&fit=crop')] bg-cover opacity-60" />

                                        {/* ID + Resolved Badge */}
                                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                                            <span className="bg-slate-900/80 text-white px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur border border-white/10">
                                                ID: {report._id.substring(0, 6)}
                                            </span>
                                            {report.status === 'resolved' && (
                                                <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur border border-emerald-500/30 flex items-center gap-1">
                                                    <Check size={10} /> Resolved
                                                </span>
                                            )}
                                        </div>

                                        {/* Severity Badge */}
                                        <div className="absolute top-3 right-3 z-20">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider backdrop-blur border ${
                                                report.severity === 'critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                                                report.severity === 'high' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                                                report.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' :
                                                'bg-green-500/20 text-green-400 border-green-500/30'
                                            }`}>
                                                {report.severity || 'medium'}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-6 flex-grow flex flex-col">
                                        {/* Category with Icon */}
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-6 h-6 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                                                {report.category === 'pothole' && '🕳️'}
                                                {report.category === 'garbage' && '🗑️'}
                                                {report.category === 'fallen_tree' && '🌳'}
                                                {report.category === 'electrical_pole' && '⚡'}
                                                {report.category === 'graffiti' && '🎨'}
                                                {!['pothole', 'garbage', 'fallen_tree', 'electrical_pole', 'graffiti'].includes(report.category) && '📷'}
                                            </div>
                                            <span className="text-cyan-400 text-xs font-bold uppercase tracking-wider">
                                                AI: {report.category}
                                            </span>
                                        </div>

                                        <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">{report.title}</h3>
                                        <p className="text-slate-400 text-sm mb-4 line-clamp-1">{report.location?.address || 'Geolocation Coordinates'}</p>

                                        {/* Timeline + Progress */}
                                        <div className="mt-auto pt-4 border-t border-white/5 space-y-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                                <Clock size={14} />
                                                Reported: {formattedDate}
                                            </div>

                                            {/* Progress Stepper */}
                                            <div>
                                                <div className="flex items-center justify-between mb-3">
                                                    {[
                                                        { step: 'Reported', active: true, completed: true },
                                                        { step: 'Review', active: report.status !== 'pending', completed: report.status !== 'pending' },
                                                        { step: 'Progress', active: report.status === 'in-progress' || report.status === 'resolved', completed: report.status === 'resolved' },
                                                        { step: 'Fixed', active: report.status === 'resolved', completed: report.status === 'resolved' }
                                                    ].map((phase) => (
                                                        <div key={phase.step} className="flex flex-col items-center flex-1">
                                                            <div className={`w-3 h-3 rounded-full border-2 mb-1 transition-colors ${
                                                                phase.completed ? 'bg-emerald-400 border-emerald-400' :
                                                                phase.active ? 'bg-amber-400 border-amber-400' :
                                                                'bg-slate-700 border-slate-600'
                                                            }`} />
                                                            <span className={`text-[8px] uppercase font-medium transition-colors ${
                                                                phase.completed ? 'text-emerald-400' :
                                                                phase.active ? 'text-amber-400' :
                                                                'text-slate-600'
                                                            }`}>
                                                                {phase.step}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Progress Bar */}
                                                <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-500"
                                                        style={{
                                                            width:
                                                                report.status === 'resolved' ? '100%' :
                                                                report.status === 'in-progress' ? '66%' :
                                                                report.status === 'pending' ? '33%' : '0%'
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => setSelectedIssue(report)}
                                            className="mt-4 w-full bg-white/5 hover:bg-white/10 text-white font-medium py-2 rounded-xl text-sm transition-colors"
                                        >
                                            View Timestamps
                                        </button>
                                    </div>
                                </motion.div>
                            )
                        })
                    ) : (
                        <div className="col-span-1 md:col-span-2 xl:col-span-3 border border-white/5 border-dashed rounded-2xl flex flex-col items-center justify-center p-12 text-center h-96 bg-slate-900/20">
                            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                                <Activity className="w-12 h-12 text-slate-600" />
                            </div>
                            <h3 className="text-white text-xl font-semibold mb-2">No reports found</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-md">
                                You haven't submitted anything that matches this criteria. Start making a difference in your community!
                            </p>
                            <Link
                                to="/report"
                                className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 px-6 py-3 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all"
                            >
                                Report Your First Issue
                            </Link>
                        </div>
                    )}
                </AnimatePresence>
            </div>

            {/* Tracking Modal Overlay */}
            <AnimatePresence>
                {selectedIssue && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedIssue(null)}
                            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
                        >
                            {/* Modal Header */}
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-slate-800/50">
                                <div>
                                    <h3 className="text-xl font-bold text-white">
                                        Tracking #{selectedIssue._id.substring(0, 8)}
                                    </h3>
                                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider">
                                        {selectedIssue.category}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedIssue(null)}
                                    className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-white/5 bg-slate-900 border border-white/5 shadow-sm"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="overflow-y-auto custom-scrollbar p-6 space-y-6">
                                {/* Thumbnail */}
                                <div className="aspect-video w-full rounded-2xl bg-slate-800 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&h=400&fit=crop')] bg-cover opacity-80 border border-white/10 relative">
                                    {selectedIssue.severity === 'critical' && (
                                        <div className="absolute top-2 left-2 bg-rose-500 text-white text-xs px-2 py-1 rounded font-bold uppercase">
                                            Critical Priority
                                        </div>
                                    )}
                                </div>

                                {/* Details */}
                                <div className="space-y-1 text-sm bg-slate-800/30 p-4 rounded-xl border border-white/5">
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-24">Location:</span>
                                        <span className="text-slate-300 font-medium break-words flex-1">
                                            {selectedIssue.location?.address || 'GPS Tagged'}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <span className="text-slate-500 w-24">Description:</span>
                                        <span className="text-slate-300 font-medium break-words flex-1">
                                            {selectedIssue.description || 'No description provided.'}
                                        </span>
                                    </div>
                                </div>

                                {/* Timeline */}
                                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-700 before:to-transparent">

                                    {/* Step 1: Reported */}
                                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                        <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-900 text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-2.5 md:ml-0 z-10">
                                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                                                <path d="M12.95 3l-6.8 6.8-3.05-3.05L2 7.85l4.1 4.1 7.9-7.9z" />
                                            </svg>
                                        </div>
                                        <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-800/80 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="font-bold text-slate-100 text-sm">Issue Dispatched</div>
                                                <div className="text-[10px] text-emerald-400 font-medium">
                                                    {format(new Date(selectedIssue.createdAt || Date.now()), 'hh:mm a')}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400">Authenticated via system</div>
                                        </div>
                                    </div>

                                    {/* Step 2: In Progress */}
                                    {(selectedIssue.status === 'in-progress' || selectedIssue.status === 'resolved') && (
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-white bg-slate-900 text-amber-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-2.5 md:ml-0 z-10">
                                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                                                    <path d="M12.95 3l-6.8 6.8-3.05-3.05L2 7.85l4.1 4.1 7.9-7.9z" />
                                                </svg>
                                            </div>
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-slate-800/80 p-3 rounded-xl border border-white/5">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-bold text-slate-100 text-sm">Active Operation</div>
                                                    <div className="text-[10px] text-amber-400 font-medium">Assigned</div>
                                                </div>
                                                <div className="text-xs text-slate-400">Authority personnel verified and initiated response.</div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 3: Resolved */}
                                    {selectedIssue.status === 'resolved' && (
                                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                                            <div className="flex items-center justify-center w-5 h-5 rounded-full border border-emerald-400 bg-slate-900 text-emerald-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 ml-2.5 md:ml-0 z-10 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
                                                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 16 16">
                                                    <path d="M12.95 3l-6.8 6.8-3.05-3.05L2 7.85l4.1 4.1 7.9-7.9z" />
                                                </svg>
                                            </div>
                                            <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">
                                                <div className="flex items-center justify-between mb-1">
                                                    <div className="font-bold text-emerald-100 text-sm">Resolved</div>
                                                </div>
                                                <div className="text-xs text-emerald-200">Incident successfully closed.</div>
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}