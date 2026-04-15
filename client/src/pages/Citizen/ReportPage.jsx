import { motion } from 'framer-motion'
import MultiStepReportForm from '../../components/Citizen/MultiStepReportForm'
import RecentNearbyReports from '../../components/Citizen/RecentNearbyReports'

export default function ReportPage() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-grow p-4 sm:p-8"
        >
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Report an Issue</h1>
                    <p className="text-xl text-slate-400 max-w-3xl mx-auto">
                        Help keep the city safe by documenting infrastructure problems. Our AI will automatically categorize and prioritize your report for the authorities.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Form - 3 columns */}
                    <div className="lg:col-span-3">
                        <MultiStepReportForm />
                    </div>

                    {/* Sidebar - 1 column */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-800/60 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sticky top-8">
                            <RecentNearbyReports />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}
