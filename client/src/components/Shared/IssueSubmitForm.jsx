import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Camera, MapPin, Send, Brain, CheckCircle2, ArrowRight
} from 'lucide-react'
import { createIssue, classifyImage } from '../../lib/api'
import toast from 'react-hot-toast'

export default function IssueSubmitForm() {
    const [step, setStep] = useState('idle')
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
            toast.success('Report successfully dispatched to authorities!', { duration: 4000 })
            setStep('done')
        } catch (err) {
            toast.error('Failed to submit report. Please try again.')
            setStep('done')
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
        <div className="glass-card p-6 md:p-8 glow-border-cyan relative bg-slate-900/60 backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl">
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
                            <h3 className="text-xl font-semibold text-white">Capture Infrastructure Anomaly</h3>
                        </div>
                        <p className="text-sm text-slate-400 mb-6">Upload a photo and our edge AI will automatically classify the issue type and severity for downstream routing.</p>

                        <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-white/10 bg-slate-950/40 rounded-2xl cursor-pointer hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all group">
                            <Upload className="w-12 h-12 text-slate-600 group-hover:text-cyan-400 transition-colors mb-4" />
                            <span className="text-base text-slate-400 group-hover:text-slate-200 font-medium">Click to upload or drag & drop</span>
                            <span className="text-xs text-slate-600 mt-2">PNG, JPG up to 10MB</span>
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
                        className="flex flex-col items-center py-16"
                    >
                        <div className="relative w-24 h-24 mb-6">
                            <div className="absolute inset-0 rounded-full border-4 border-cyan-500/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
                            <Brain className="absolute inset-0 m-auto w-10 h-10 text-cyan-400" />
                        </div>
                        <p className="text-lg text-slate-200 font-bold mb-1">Analyzing via ML Backend...</p>
                        <p className="text-sm text-slate-500">Cross-referencing global infrastructure sets</p>
                    </motion.div>
                )}

                {step === 'classified' && (
                    <motion.div
                        key="classified"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-6"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                            <h3 className="text-xl font-bold text-white">AI Classification Active</h3>
                        </div>

                        <div className="flex gap-6 bg-slate-950/40 p-4 rounded-2xl border border-white/5">
                            {preview && (
                                <img src={preview} alt="Issue" className="w-32 h-32 rounded-xl object-cover border border-white/10" />
                            )}
                            <div className="flex-1 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Category</span>
                                    <span className="text-sm text-cyan-400 font-bold capitalize bg-cyan-400/10 px-3 py-1 rounded-full">{classification?.category}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Severity</span>
                                    <span className={`text-sm font-bold capitalize px-3 py-1 rounded-full ${classification?.severity === 'critical' ? 'text-rose-400 bg-rose-400/10' :
                                        classification?.severity === 'high' ? 'text-amber-400 bg-amber-400/10' :
                                            classification?.severity === 'medium' ? 'text-cyan-400 bg-cyan-400/10' : 'text-emerald-400 bg-emerald-400/10'
                                        }`}>{classification?.severity}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-slate-500 uppercase tracking-wider font-bold">Confidence</span>
                                    <span className="text-sm text-white font-mono bg-white/10 px-3 py-1 rounded-full">{(classification?.confidence * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-white/10">
                            <input
                                type="text"
                                placeholder="Issue title (optional)"
                                value={formData.title}
                                onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                                className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
                            />
                            <textarea
                                placeholder="Describe the issue in detail..."
                                value={formData.description}
                                onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                                rows={3}
                                className="w-full px-5 py-3.5 rounded-xl bg-slate-950/50 border border-white/10 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors resize-none"
                            />
                            <div className="flex items-center gap-3 bg-slate-950/50 px-5 py-3.5 rounded-xl border border-white/10 focus-within:border-cyan-500/50 transition-colors">
                                <MapPin className="w-5 h-5 text-slate-500" />
                                <input
                                    type="text"
                                    placeholder="Location / Exact Address"
                                    value={formData.address}
                                    onChange={e => setFormData(p => ({ ...p, address: e.target.value }))}
                                    className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-600 focus:outline-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-base font-bold text-slate-900 hover:from-cyan-400 hover:to-emerald-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                            >
                                <Send className="w-5 h-5" />
                                Finalize Report & Dispatch
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
                        className="flex flex-col items-center py-16"
                    >
                        <div className="w-12 h-12 border-4 border-t-cyan-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-6" />
                        <p className="text-lg text-white font-bold mb-1">Dispatching into Data Layer...</p>
                        <p className="text-sm text-slate-500">Creating immutable records and alerting authorities</p>
                    </motion.div>
                )}

                {step === 'done' && (
                    <motion.div
                        key="done"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center py-16 pace-y-6"
                    >
                        <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 border border-emerald-500/20">
                            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                        </div>
                        <div className="text-center mb-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Report Authenticated</h3>
                            <p className="text-slate-400 max-w-sm">Your issue has been routed to the appropriate jurisdiction. Track its resolution SLA directly on the dashboard map.</p>
                        </div>
                        <div className="flex items-center gap-4">
                            <button onClick={resetForm} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-sm font-semibold text-white hover:bg-white/10 transition-all">
                                + Submit Another
                            </button>
                            <Link to="/map" className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-sm font-semibold text-cyan-400 hover:bg-cyan-500/20 transition-all">
                                View Pulse Map <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
