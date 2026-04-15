import { Outlet } from 'react-router-dom'
import TopNavBar from '../components/Navigation/TopNavBar'
import FloatingActionButton from '../components/Navigation/FloatingActionButton'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'

export default function CitizenLayout() {
    const location = useLocation()

    return (
        <div className="min-h-screen bg-[#070b14] text-slate-200 overflow-x-hidden selection:bg-cyan-500/30">
            {/* Global background effects */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px]" />
                <div className="absolute top-[40%] right-[-10%] w-[30%] h-[50%] bg-emerald-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[30%] bg-violet-600/10 rounded-full blur-[120px]" />
            </div>

            {/* Navigation Navigation */}
            <TopNavBar />

            {/* Global Floating Actions */}
            <FloatingActionButton />

            {/* Main Content Area */}
            <main className="relative z-10 pt-16 min-h-screen flex flex-col">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                        className="flex-grow flex flex-col"
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </main>
        </div>
    )
}
