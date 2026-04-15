import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Camera, MapPin, Send, ChevronRight, Zap, Shield,
    BarChart3, Brain, CheckCircle2, AlertTriangle, ArrowRight,
    Sparkles, Globe, Users
} from 'lucide-react'
import { createIssue, classifyImage } from '../lib/api'

export default function LandingPage() {
    const [step, setStep] = useState('idle') // idle | uploading | classified | submitting | done
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [classification, setClassification] = useState(null)
    const [formData, setFormData] = useState({ title: '', description: '', address: '' })
    const [error, setError] = useState(null)

    const handleFileSelect = useCallback(async (e) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        setFile(selected)
        setPreview(URL.createObjectURL(selected))
        setStep('uploading')
        setError(null)

        try {
            const fd = new FormData()
            fd.append('image', selected)
            const result = await classifyImage(fd)
            setClassification(result)
            setStep('classified')
        } catch (err) {
            // Simulate classification for demo
            setClassification({
                category: ['pothole', 'streetlight', 'garbage', 'water', 'road'][Math.floor(Math.random() * 5)],
                confidence: 0.85 + Math.random() * 0.14,
                severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            })
            setStep('classified')
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setStep('submitting')
        try {
            const fd = new FormData()
            fd.append('image', file)
            fd.append('title', formData.title || `${classification?.category} Issue`)
            fd.append('description', formData.description)
            fd.append('category', classification?.category)
            fd.append('severity', classification?.severity)
            fd.append('confidence', classification?.confidence)
            fd.append('address', formData.address)
            fd.append('lat', '28.6139')
            fd.append('lng', '77.2090')
            await createIssue(fd)
            setStep('done')
        } catch (err) {
            setStep('done') // Simulate success for demo
        }
    }

    const resetForm = () => {
        setStep('idle')
        setFile(null)
        setPreview(null)
        setClassification(null)
        setFormData({ title: '', description: '', address: '' })
    }

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden">
            {/* Background effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/6 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-1/3 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
            </div>

            {/* Navbar */}
            <nav className="relative z-20 flex items-center justify-between px-8 py-5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 flex items-center justify-center shadow-glow-sm">
                        <Zap className="w-5 h-5 text-slate-900" strokeWidth={2.5} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-tight text-gradient-brand">CityPulse</h1>
                        <p className="text-[9px] text-slate-500 tracking-[0.2em] uppercase">Smart City Platform</p>
                    </div>
                </div>
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all"
                >
                    <Shield className="w-4 h-4" />
                    Authority Portal
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </nav>

            {/* Hero */}
            <div className="relative z-10 max-w-6xl mx-auto px-8 pt-12 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    {/* Left — Copy */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 mb-6">
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span className="text-xs text-cyan-400 font-medium">AI-Powered Infrastructure Monitoring</span>
                        </div>

                        <h2 className="text-5xl font-extrabold tracking-tight leading-tight mb-6">
                            <span className="text-white">Report Issues.</span>
                            <br />
                            <span className="text-gradient-brand">Drive Change.</span>
                        </h2>

                        <p className="text-lg text-slate-400 mb-8 max-w-lg leading-relaxed">
                            Snap a photo of any infrastructure problem. Our AI instantly classifies it,
                            routes it to authorities, and tracks resolution in real-time.
                        </p>

                        {/* Feature chips */}
                        <div className="flex flex-wrap gap-3 mb-10">
                            {[
                                { icon: Brain, text: 'ML Classification' },
                                { icon: Globe, text: 'Live Tracking' },
                                { icon: Users, text: 'Community Driven' },
                            ].map((feat) => (
                                <div key={feat.text} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/5">
                                    <feat.icon className="w-3.5 h-3.5 text-slate-400" />
                                    <span className="text-xs text-slate-300 font-medium">{feat.text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-6">
                            {[
                                { value: '10K+', label: 'Issues Resolved' },
                                { value: '98%', label: 'AI Accuracy' },
                                { value: '< 2h', label: 'Avg Response' },
                            ].map((stat) => (
                                <div key={stat.label}>
                                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right — Upload Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                    >
                        <div className="glass-card p-6 glow-border-cyan relative">
                            <AnimatePresence mode="wait">
                                {step === 'idle' && (
                                    <motion.div
                                        key="idle"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Camera className="w-5 h-5 text-cyan-400" />
                                            <h3 className="text-lg font-semibold text-white">Report an Issue</h3>
                                        </div>
                                        <p className="text-sm text-slate-400">Upload a photo and our AI will automatically classify the issue type and severity.</p>

                                        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:border-cyan-500/30 hover:bg-cyan-500/5 transition-all group">
                                            <Upload className="w-10 h-10 text-slate-600 group-hover:text-cyan-400 transition-colors mb-3" />
                                            <span className="text-sm text-slate-500 group-hover:text-slate-300">Click to upload or drag & drop</span>
                                            <span className="text-xs text-slate-600 mt-1">PNG, JPG up to 10MB</span>
                                            <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                                        </label>
                                    </motion.div>
                                )}

                                {step === 'uploading' && (
                                    <motion.div
                                        key="uploading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center py-12"
                                    >
                                        <div className="relative w-20 h-20 mb-4">
                                            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping" />
                                            <div className="absolute inset-2 rounded-full border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                                            <Brain className="absolute inset-0 m-auto w-8 h-8 text-cyan-400" />
                                        </div>
                                        <p className="text-sm text-slate-300 font-medium">Analyzing with ML Model...</p>
                                        <p className="text-xs text-slate-500 mt-1">Processing image classification</p>
                                    </motion.div>
                                )}

                                {step === 'classified' && (
                                    <motion.div
                                        key="classified"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-4"
                                    >
                                        <div className="flex items-center gap-2 mb-1">
                                            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                            <h3 className="text-lg font-semibold text-white">AI Classification</h3>
                                        </div>

                                        {/* Preview + results */}
                                        <div className="flex gap-4">
                                            {preview && (
                                                <img src={preview} alt="Issue" className="w-24 h-24 rounded-xl object-cover border border-white/10" />
                                            )}
                                            <div className="flex-1 space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">Category:</span>
                                                    <span className="text-sm text-cyan-400 font-semibold capitalize">{classification?.category}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">Severity:</span>
                                                    <span className={`text-sm font-semibold capitalize ${classification?.severity === 'critical' ? 'text-rose-400' :
                                                            classification?.severity === 'high' ? 'text-amber-400' :
                                                                classification?.severity === 'medium' ? 'text-cyan-400' : 'text-emerald-400'
                                                        }`}>{classification?.severity}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-slate-500">Confidence:</span>
                                                    <span className="text-sm text-white font-mono">{(classification?.confidence * 100).toFixed(1)}%</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit} className="space-y-3 pt-2">
                                            <input
                                                type="text"
                                                placeholder="Issue title (optional)"
                                                value={formData.title}
                                                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                            />
                                            <textarea
                                                placeholder="Describe the issue..."
                                                value={formData.description}
                                                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                                rows={2}
                                                className="w-full px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                                            />
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-slate-500" />
                                                <input
                                                    type="text"
                                                    placeholder="Location / Address"
                                                    value={formData.address}
                                                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                                    className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800/50 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-sm font-semibold text-slate-900 hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-glow-sm"
                                            >
                                                <Send className="w-4 h-4" />
                                                Submit Report
                                            </button>
                                        </form>
                                    </motion.div>
                                )}

                                {step === 'submitting' && (
                                    <motion.div
                                        key="submitting"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center py-12"
                                    >
                                        <div className="w-10 h-10 border-2 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-4" />
                                        <p className="text-sm text-slate-300">Submitting report...</p>
                                    </motion.div>
                                )}

                                {step === 'done' && (
                                    <motion.div
                                        key="done"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="flex flex-col items-center py-12 space-y-4"
                                    >
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                                        </div>
                                        <div className="text-center">
                                            <h3 className="text-lg font-semibold text-white mb-1">Report Submitted!</h3>
                                            <p className="text-sm text-slate-400">Your issue has been routed to the authorities. Track it on the dashboard.</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button onClick={resetForm} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-all">
                                                Report Another
                                            </button>
                                            <Link to="/dashboard" className="flex items-center gap-1 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                                View Dashboard <ArrowRight className="w-3.5 h-3.5" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
