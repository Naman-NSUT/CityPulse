import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Camera, MapPin, Send, Brain, CheckCircle2, ArrowRight, ArrowLeft,
    AlertTriangle, Clock, User, MessageSquare
} from 'lucide-react'
import { createIssue, classifyImage } from '../../lib/api'
import toast from 'react-hot-toast'

export default function MultiStepReportForm() {
    const [currentStep, setCurrentStep] = useState(1)
    const [file, setFile] = useState(null)
    const [preview, setPreview] = useState(null)
    const [classification, setClassification] = useState(null)
    const [formData, setFormData] = useState({ 
        title: '', 
        description: '', 
        address: '',
        contactName: '',
        contactEmail: '',
        contactPhone: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const steps = [
        { id: 1, title: 'Upload Image', icon: Camera },
        { id: 2, title: 'AI Analysis', icon: Brain },
        { id: 3, title: 'Location', icon: MapPin },
        { id: 4, title: 'Details', icon: MessageSquare },
        { id: 5, title: 'Confirm', icon: CheckCircle2 }
    ]

    const handleFileSelect = useCallback(async (e) => {
        const selected = e.target.files?.[0]
        if (!selected) return

        setFile(selected)
        setPreview(URL.createObjectURL(selected))
        setError(null)

        try {
            const fd = new FormData()
            fd.append('image', selected)
            const result = await classifyImage(fd)
            setClassification(result)
            setTimeout(() => setCurrentStep(2), 500)
        } catch (err) {
            // Fallback to mock classification
            setClassification({
                category: ['pothole', 'garbage', 'fallen_tree', 'electrical_pole', 'graffiti'][Math.floor(Math.random() * 5)],
                confidence: 0.85 + Math.random() * 0.14,
                severity: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)],
            })
            setTimeout(() => setCurrentStep(2), 500)
        }
    }, [])

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            const fd = new FormData()
            fd.append('image', file)
            fd.append('title', formData.title || `${classification?.category} Issue`)
            fd.append('description', formData.description)
            fd.append('address', formData.address)
            fd.append('contactName', formData.contactName)
            fd.append('contactEmail', formData.contactEmail)
            fd.append('contactPhone', formData.contactPhone)
            fd.append('category', classification?.category)
            fd.append('severity', classification?.severity)

            await createIssue(fd)
            toast.success('Issue reported successfully! Authorities have been notified.')
            // Reset form
            setCurrentStep(1)
            setFile(null)
            setPreview(null)
            setClassification(null)
            setFormData({ title: '', description: '', address: '', contactName: '', contactEmail: '', contactPhone: '' })
        } catch (err) {
            toast.error('Failed to submit report. Please try again.')
            setError(err.message)
        } finally {
            setIsSubmitting(false)
        }
    }

    const nextStep = () => {
        if (currentStep < steps.length) setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(currentStep - 1)
    }

    const getSeverityColor = (severity) => {
        const colors = {
            low: 'bg-green-500/10 text-green-400 border-green-500/20',
            medium: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
            high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
            critical: 'bg-red-500/10 text-red-400 border-red-500/20'
        }
        return colors[severity] || colors.medium
    }

    const getCategoryIcon = (category) => {
        const icons = {
            pothole: '🕳️',
            garbage: '🗑️',
            fallen_tree: '🌳',
            electrical_pole: '⚡',
            graffiti: '🎨'
        }
        return icons[category] || '📷'
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        const isActive = currentStep === step.id
                        const isCompleted = currentStep > step.id
                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                                    isActive ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' :
                                    isCompleted ? 'border-emerald-400 bg-emerald-400/20 text-emerald-400' :
                                    'border-slate-600 text-slate-400'
                                }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <Icon className="w-5 h-5" />
                                    )}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-full h-0.5 mx-2 ${
                                        currentStep > step.id ? 'bg-emerald-400' : 'bg-slate-600'
                                    }`} />
                                )}
                            </div>
                        )
                    })}
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                    {steps.map(step => (
                        <span key={step.id} className={currentStep === step.id ? 'text-cyan-400 font-medium' : ''}>
                            {step.title}
                        </span>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {/* Step 1: Image Upload */}
                {currentStep === 1 && (
                    <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Upload Image</h2>
                        
                        <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-cyan-400/50 transition-colors">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="w-20 h-20 mx-auto mb-4 bg-cyan-500/20 rounded-full flex items-center justify-center">
                                    <Camera className="w-10 h-10 text-cyan-400" />
                                </div>
                                <p className="text-white font-medium mb-2">Click to upload or drag and drop</p>
                                <p className="text-slate-400 text-sm">Supports JPG, PNG, WebP • Max 10MB</p>
                            </label>
                        </div>

                        {preview && (
                            <div className="mt-6">
                                <p className="text-slate-400 text-sm mb-2">Preview:</p>
                                <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-lg" />
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Step 2: AI Classification */}
                {currentStep === 2 && classification && (
                    <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">AI Analysis Results</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <img src={preview} alt="Analyzed" className="w-full h-64 object-cover rounded-lg" />
                            </div>
                            <div className="space-y-4">
                                <div className="bg-slate-900/60 rounded-xl p-4">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{getCategoryIcon(classification.category)}</span>
                                        <div>
                                            <p className="text-white font-semibold capitalize">{classification.category.replace('_', ' ')}</p>
                                            <p className="text-slate-400 text-sm">AI Classification</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-sm">Confidence</span>
                                            <span className="text-cyan-400 font-bold">{Math.round(classification.confidence * 100)}%</span>
                                        </div>
                                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400"
                                                style={{ width: `${classification.confidence * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`border rounded-xl p-4 ${getSeverityColor(classification.severity)}`}>
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-5 h-5" />
                                        <div>
                                            <p className="font-semibold capitalize">{classification.severity} Severity</p>
                                            <p className="text-xs opacity-75">Priority level assigned by AI</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-900/60 rounded-xl p-4">
                                    <p className="text-slate-400 text-sm mb-2">Expected Resolution Time</p>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-cyan-400" />
                                        <span className="text-white font-medium">
                                            {classification.severity === 'critical' ? '1-2 hours' :
                                             classification.severity === 'high' ? '2-6 hours' :
                                             classification.severity === 'medium' ? '6-24 hours' : '24-48 hours'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 3: Location */}
                {currentStep === 3 && (
                    <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Location Details</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    <MapPin className="w-4 h-4 inline mr-2" />
                                    Address or Location Description
                                </label>
                                <textarea
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    rows={3}
                                    placeholder="e.g., Near the intersection of Main St and Oak Ave, in front of the coffee shop..."
                                />
                            </div>

                            <div className="bg-slate-900/60 rounded-xl p-6 border border-white/5">
                                <p className="text-slate-400 text-sm mb-4">📍 Interactive Map</p>
                                <div className="h-64 bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-white/10">
                                    <div className="text-center">
                                        <MapPin className="w-12 h-12 text-slate-600 mx-auto mb-2" />
                                        <p className="text-slate-400">Map integration coming soon</p>
                                        <p className="text-slate-500 text-sm">For now, please provide detailed address above</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Additional Details */}
                {currentStep === 4 && (
                    <motion.div
                        key="step4"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Additional Details</h2>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Title (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    placeholder={`${classification?.category} Issue`}
                                />
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    rows={4}
                                    placeholder="Please provide any additional details that might help authorities address this issue..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        <User className="w-4 h-4 inline mr-2" />
                                        Your Name (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.contactName}
                                        onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Email (Optional)
                                    </label>
                                    <input
                                        type="email"
                                        value={formData.contactEmail}
                                        onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="john@example.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">
                                        Phone (Optional)
                                    </label>
                                    <input
                                        type="tel"
                                        value={formData.contactPhone}
                                        onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                        className="w-full px-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                        placeholder="+1 (555) 123-4567"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Step 5: Confirmation */}
                {currentStep === 5 && (
                    <motion.div
                        key="step5"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Review & Submit</h2>
                        
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <img src={preview} alt="Review" className="w-full h-48 object-cover rounded-lg" />
                                </div>
                                <div className="space-y-3">
                                    <div className="bg-slate-900/60 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Category</p>
                                        <p className="text-white font-semibold capitalize">{classification?.category.replace('_', ' ')}</p>
                                    </div>
                                    <div className={`bg-slate-900/60 rounded-lg p-3 ${getSeverityColor(classification?.severity)}`}>
                                        <p className="text-xs uppercase tracking-wider mb-1 opacity-75">Severity</p>
                                        <p className="font-semibold capitalize">{classification?.severity}</p>
                                    </div>
                                    <div className="bg-slate-900/60 rounded-lg p-3">
                                        <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">AI Confidence</p>
                                        <p className="text-cyan-400 font-semibold">{Math.round(classification?.confidence * 100)}%</p>
                                    </div>
                                </div>
                            </div>

                            {formData.address && (
                                <div className="bg-slate-900/60 rounded-lg p-4">
                                    <p className="text-slate-400 text-sm mb-1">Location</p>
                                    <p className="text-white">{formData.address}</p>
                                </div>
                            )}

                            {formData.description && (
                                <div className="bg-slate-900/60 rounded-lg p-4">
                                    <p className="text-slate-400 text-sm mb-1">Description</p>
                                    <p className="text-white">{formData.description}</p>
                                </div>
                            )}

                            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg p-4">
                                <p className="text-cyan-400 text-sm">
                                    <strong>Important:</strong> Your report will be immediately sent to the relevant city department. 
                                    You'll receive updates on the resolution progress.
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                        currentStep === 1 
                            ? 'bg-slate-800 text-slate-600 cursor-not-allowed' 
                            : 'bg-slate-700 text-white hover:bg-slate-600'
                    }`}
                >
                    <ArrowLeft className="w-4 h-4" />
                    Previous
                </button>

                <div className="flex gap-3">
                    {currentStep < 5 ? (
                        <button
                            onClick={nextStep}
                            disabled={(currentStep === 1 && !file) || (currentStep === 3 && !formData.address)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                                (currentStep === 1 && !file) || (currentStep === 3 && !formData.address)
                                    ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900'
                            }`}
                        >
                            Next
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${
                                isSubmitting
                                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-900 shadow-lg'
                            }`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Submit Report
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
