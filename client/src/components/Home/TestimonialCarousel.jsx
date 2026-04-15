import { motion } from 'framer-motion'
import { MessageSquareQuote, Star } from 'lucide-react'

export default function TestimonialCarousel() {
    const testimonials = [
        {
            name: "Rahul M.",
            role: "Sector 12 Resident",
            quote: "Reported a massive pothole in the morning on my way to work. By the time I headed back, CityPulse had a team there laying fresh asphalt. I was blown away by the live tracking.",
            img: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=150&h=150&fit=crop"
        },
        {
            name: "Priya S.",
            role: "Local Business Owner",
            quote: "The AI classification is instant. I took a blurry photo of graffiti at night, and within 3 seconds, it was routed to the sanitation department correctly. Completely seamless UI.",
            img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
        },
        {
            name: "Vikram R.",
            role: "Commuter",
            quote: "The heatmaps on the dashboard are incredible. You can see exactly which sectors are having power grid failures before you even start your commute. Game changer.",
            img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
        }
    ]

    return (
        <div className="py-24 relative overflow-hidden bg-slate-900 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <MessageSquareQuote size={40} className="text-cyan-400 mx-auto mb-6 opacity-80" />
                    <h2 className="text-3xl font-bold text-white mb-4">What Citizens Are Saying</h2>
                    <p className="text-slate-400 text-lg">
                        CityPulse isn't just software. It's a bridge between residents and the authorities.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-slate-800/40 p-8 rounded-3xl border border-white/5 flex flex-col relative"
                        >
                            <div className="flex text-amber-400 mb-6 gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={16} fill="currentColor" />)}
                            </div>

                            <p className="text-slate-300 text-lg italic mb-8 flex-grow">
                                "{t.quote}"
                            </p>

                            <div className="flex items-center gap-4 mt-auto border-t border-white/10 pt-6">
                                <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover border-2 border-slate-700" />
                                <div>
                                    <h4 className="text-white font-bold">{t.name}</h4>
                                    <span className="text-cyan-400 text-sm font-medium">{t.role}</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
