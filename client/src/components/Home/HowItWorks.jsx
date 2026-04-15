import { motion } from 'framer-motion'
import { Camera, Brain, Users } from 'lucide-react'

export default function HowItWorks() {
    const steps = [
        {
            icon: Camera,
            title: 'Snap',
            description: 'Take a photo of any infrastructure issue - potholes, graffiti, broken lights, and more.',
            color: 'from-cyan-500 to-blue-500'
        },
        {
            icon: Brain,
            title: 'AI Classifies',
            description: 'Our advanced AI analyzes and categorizes the issue with 98% accuracy in seconds.',
            color: 'from-violet-500 to-purple-500'
        },
        {
            icon: Users,
            title: 'Authorities Act',
            description: 'Instant alerts sent to relevant city departments with location and severity details.',
            color: 'from-emerald-500 to-green-500'
        }
    ]

    return (
        <section className="py-20 bg-slate-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Three simple steps to report and resolve city infrastructure issues
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="relative"
                            >
                                {/* Connection Line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-white/10 to-transparent" />
                                )}
                                
                                <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 text-center hover:border-white/20 transition-colors">
                                    <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center`}>
                                        <Icon className="w-8 h-8 text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {step.title}
                                    </h3>
                                    <p className="text-slate-400 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
