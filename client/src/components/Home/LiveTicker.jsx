import { motion } from 'framer-motion'
import { AlertCircle, CheckCircle, Clock, MapPin } from 'lucide-react'

export default function LiveTicker() {
    const incidents = [
        { type: 'alert', icon: AlertCircle, color: 'text-red-400', message: 'Pothole reported in Sector 12', location: 'Downtown' },
        { type: 'review', icon: Clock, color: 'text-yellow-400', message: 'Graffiti under review', location: 'City Center' },
        { type: 'resolved', icon: CheckCircle, color: 'text-green-400', message: 'Road damage fixed', location: 'Zone 4' },
        { type: 'alert', icon: AlertCircle, color: 'text-red-400', message: 'Fallen tree blocking road', location: 'Oak Street' },
        { type: 'review', icon: Clock, color: 'text-yellow-400', message: 'Broken streetlight reported', location: 'Main Avenue' },
        { type: 'resolved', icon: CheckCircle, color: 'text-green-400', message: 'Garbage collection completed', location: 'Residential Area' },
    ]

    return (
        <div className="relative overflow-hidden bg-slate-900/80 backdrop-blur-sm border-y border-white/10 z-20">
            <div className="flex items-center">
                <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 text-white px-4 py-2 text-sm font-bold whitespace-nowrap">
                    🔴 LIVE INCIDENTS
                </div>
                <motion.div
                    className="flex items-center space-x-8 py-2"
                    animate={{
                        x: [0, -incidents.length * 400]
                    }}
                    transition={{
                        x: {
                            repeat: Infinity,
                            repeatType: "loop",
                            duration: 20,
                            ease: "linear",
                        },
                    }}
                >
                    {[...incidents, ...incidents].map((incident, index) => {
                        const Icon = incident.icon
                        return (
                            <div
                                key={index}
                                className="flex items-center space-x-2 whitespace-nowrap px-4"
                            >
                                <Icon className={`w-4 h-4 ${incident.color}`} />
                                <span className="text-white text-sm font-medium">
                                    {incident.message}
                                </span>
                                <span className="text-slate-400 text-xs flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    {incident.location}
                                </span>
                                <span className="text-slate-500 text-xs">•</span>
                            </div>
                        )
                    })}
                </motion.div>
            </div>
        </div>
    )
}
