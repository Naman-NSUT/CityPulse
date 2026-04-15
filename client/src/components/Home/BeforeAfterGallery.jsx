import ReactCompareImage from 'react-compare-image'
import { motion } from 'framer-motion'
import { Clock } from 'lucide-react'

export default function BeforeAfterGallery() {
    const transformations = [
        {
            category: "Major Pothole",
            location: "Sector 12, Ring Road",
            time: "1.2 hours",
            before: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop",
            after: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&h=400&fit=crop&blur=100" // using blur to mock fixed
        },
        {
            category: "Graffiti Removal",
            location: "Central Park Metro",
            time: "3.5 hours",
            before: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&h=400&fit=crop",
            after: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=600&h=400&fit=crop&blur=10"
        }
    ]

    return (
        <div className="py-24 relative bg-slate-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-4">Recent Transformations</h2>
                        <p className="text-slate-400 text-lg max-w-2xl">
                            Drag the slider to see how reported issues are resolved through the CityPulse ecosystem.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {transformations.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-slate-800/50 rounded-3xl p-6 border border-white/5 shadow-2xl"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{item.category}</h3>
                                    <span className="text-slate-400 text-sm">{item.location}</span>
                                </div>
                                <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center gap-1.5">
                                    <Clock size={14} /> Resolved in {item.time}
                                </div>
                            </div>

                            <div className="rounded-2xl overflow-hidden border border-white/10 h-[300px] bg-slate-900">
                                <ReactCompareImage
                                    leftImage={item.before}
                                    rightImage={item.after}
                                    leftImageLabel="Before Report"
                                    rightImageLabel="After Fix"
                                    sliderLineWidth={3}
                                    sliderLineColor="#0ea5e9"
                                    hover={true}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
