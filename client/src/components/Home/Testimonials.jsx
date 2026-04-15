import { motion } from 'framer-motion'
import { Quote, Star, MapPin } from 'lucide-react'

export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: 'Sarah Johnson',
            location: 'Downtown Resident',
            content: 'I reported a dangerous pothole and it was fixed within 24 hours! The AI classification is incredibly accurate and the city response was immediate.',
            rating: 5,
            impact: 'Helped fix 3 issues in her neighborhood',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
        },
        {
            id: 2,
            name: 'Michael Chen',
            location: 'City Council Member',
            content: 'CityPulse has transformed how we handle infrastructure issues. The real-time data and AI prioritization help us allocate resources more effectively.',
            rating: 5,
            impact: 'Improved city response time by 70%',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
        },
        {
            id: 3,
            name: 'Emily Rodriguez',
            location: 'Community Activist',
            content: 'Finally, a platform that actually works! The transparency and tracking features give citizens confidence that their reports matter.',
            rating: 5,
            impact: 'Organized 20+ community clean-up events',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
        }
    ]

    return (
        <section className="py-20 bg-slate-800/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl font-bold text-white mb-4">
                        Community Impact
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Hear from citizens and authorities making a difference with CityPulse
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300 relative"
                        >
                            {/* Quote Icon */}
                            <div className="absolute top-6 right-6">
                                <Quote className="w-8 h-8 text-cyan-500/20" />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>

                            {/* Content */}
                            <blockquote className="text-slate-300 leading-relaxed mb-6 text-sm">
                                "{testimonial.content}"
                            </blockquote>

                            {/* Impact Badge */}
                            <div className="bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 rounded-lg px-3 py-2 mb-6">
                                <p className="text-cyan-400 text-xs font-medium">
                                    {testimonial.impact}
                                </p>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.avatar}
                                    alt={testimonial.name}
                                    className="w-12 h-12 rounded-full object-cover border-2 border-white/10"
                                />
                                <div>
                                    <div className="text-white font-semibold text-sm">
                                        {testimonial.name}
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400 text-xs">
                                        <MapPin className="w-3 h-3" />
                                        {testimonial.location}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats Row */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '10,487+', label: 'Issues Resolved' },
                        { value: '98.2%', label: 'User Satisfaction' },
                        { value: '2.1h', label: 'Avg Resolution Time' },
                        { value: '127', label: 'Active Cities' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center bg-slate-800/40 rounded-xl p-6 border border-white/5"
                        >
                            <div className="text-3xl font-bold text-white mb-2">
                                {stat.value}
                            </div>
                            <div className="text-slate-400 text-sm">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
