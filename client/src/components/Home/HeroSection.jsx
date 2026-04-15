import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Zap, Target, ActivitySquare, Camera, Users, CheckCircle } from 'lucide-react'
import LiveTicker from './LiveTicker'
import HowItWorks from './HowItWorks'
import StatsDashboard from './StatsDashboard'
import RecentActivity from './RecentActivity'
import Testimonials from './Testimonials'

export default function HeroSection() {
    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 bg-[#070b14]">
                <div className="absolute inset-0 bg-grid-white-opacity-02" />
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-emerald-500/5" />
            </div>
            
            {/* Floating Particles */}
            <div className="absolute inset-0 overflow-hidden z-0">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -100, 0],
                            opacity: [0, 1, 0],
                            scale: [0, 1, 0],
                        }}
                        transition={{
                            duration: 3 + Math.random() * 2,
                            repeat: Infinity,
                            delay: Math.random() * 2,
                        }}
                    />
                ))}
            </div>

            {/* Live Ticker */}
            <LiveTicker />
            
            <div className="relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">

                    {/* Left Column - Text Content (60%) */}
                    <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-7 lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h1 className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl xl:text-7xl">
                                <span className="block mb-2">Report Issues.</span>
                                <span className="block mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Drive Change.</span>
                                <span className="block">See Impact.</span>
                            </h1>

                            <motion.p
                                className="mt-6 text-xl text-slate-300 sm:mt-8 max-w-xl mx-auto lg:mx-0 font-medium h-[60px]"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Snap a photo of any infrastructure problem. Our AI classifies it in seconds and authorities receive instant alerts.
                            </motion.p>

                            {/* Feature Pills */}
                            <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3">
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold shadow-[0_0_10px_rgba(6,182,212,0.1)]">
                                    <Zap size={16} /> AI Classification
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                                    <ActivitySquare size={16} /> Live Tracking
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-semibold shadow-[0_0_10px_rgba(139,92,246,0.1)]">
                                    <Target size={16} /> Community Driven
                                </span>
                            </div>

                            {/* Stats */}
                            <div className="mt-12 grid grid-cols-4 gap-4 sm:gap-6 border-t border-white/10 pt-8">
                                <div>
                                    <div className="text-3xl font-bold text-white mb-1">
                                        10,487+
                                    </div>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Resolved</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">
                                        98%
                                    </h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">AI Accuracy</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">&lt; 2h</h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Response</p>
                                </div>
                                <div>
                                    <h4 className="text-3xl font-bold text-white mb-1">
                                        127
                                    </h4>
                                    <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Cities</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column - Interactive Upload (40%) */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                        className="mt-16 sm:mt-24 lg:mt-0 lg:col-span-5 relative"
                    >
                        {/* Glow Behind the Box */}
                        <div className="absolute -inset-1 blur-3xl bg-gradient-to-r from-cyan-500 opacity-20 to-emerald-500 rounded-[3rem] z-0" />

                        <div className="relative glass-card p-6 md:p-8 border border-white/10 shadow-2xl rounded-3xl overflow-hidden bg-slate-900/60 backdrop-blur-2xl z-10 w-full">
                            <h3 className="text-xl font-bold text-white mb-4">Start a Report Now</h3>

                            <div className="aspect-[4/3] w-full rounded-xl overflow-hidden border border-white/5 border-dashed bg-slate-950/50 relative group flex items-center justify-center mb-6">
                                {/* Simulated Interactive Upload element instead of raw form for aesthetics on landing */}
                                <Link to="/report" className="absolute inset-0 flex items-center justify-center h-full w-full">
                                    <div className="flex flex-col items-center justify-center p-6 text-center transform transition-all group-hover:scale-105">
                                        <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                                        </div>
                                        <p className="text-white font-medium mb-1">Click to Capture or Upload</p>
                                        <p className="text-xs text-slate-500">Supports JPG, PNG • Max 10MB</p>
                                    </div>
                                </Link>
                            </div>

                            <div className="pt-4 border-t border-white/5">
                                <h4 className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-3">Live Edge Classifications</h4>
                                <div className="space-y-3">
                                    {[
                                        { issue: 'Pothole', conf: '99%', color: 'from-amber-400' },
                                        { issue: 'Graffiti', conf: '87%', color: 'from-emerald-400' }
                                    ].map((mock, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-slate-800/40 p-2.5 rounded-lg border border-white/5">
                                            <div className="w-8 h-8 bg-slate-700 rounded overflow-hidden">
                                                <div className="w-full h-full opacity-50 bg-[url('https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=100&q=80')] bg-cover"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between text-xs mb-1">
                                                    <span className="text-slate-300 font-medium">{mock.issue}</span>
                                                    <span className="text-slate-500">{mock.conf}</span>
                                                </div>
                                                <div className="h-1 bg-slate-800 rounded-full w-full overflow-hidden">
                                                    <div className={`h-full bg-gradient-to-r ${mock.color} to-transparent w-[${mock.conf}]`}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    </div>
                </div>
            </div>
            
            {/* How It Works Section */}
            <HowItWorks />
            
            {/* Stats Dashboard */}
            <StatsDashboard />
            
            {/* Recent Activity Feed */}
            <RecentActivity />
            
            {/* Testimonials */}
            <Testimonials />
        </div>
    )
}
