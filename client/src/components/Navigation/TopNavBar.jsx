import { useState, useEffect } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Map, Home, PlusCircle, Activity, Menu, X, Rocket } from 'lucide-react'

export default function TopNavBar() {
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    const links = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Report', path: '/report', icon: PlusCircle },
        { name: 'Map Tracking', path: '/map', icon: Map },
        { name: 'My Activity', path: '/my-reports', icon: Activity },
    ]

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-slate-900/80 backdrop-blur-md border-b border-white/10 shadow-lg' : 'bg-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center pr-4">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-gradient-to-tr from-cyan-500 to-emerald-400 p-1.5 rounded-lg">
                                <Rocket className="h-5 w-5 text-slate-900 stroke-[2.5]" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                                CityPulse
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex flex-1 justify-center space-x-6">
                        {links.map((link) => (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.path === '/'}
                                className={({ isActive }) =>
                                    `relative px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'text-cyan-400' : 'text-slate-300 hover:text-white'}`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <div className="flex items-center gap-1.5">
                                            <link.icon size={16} />
                                            <span>{link.name}</span>
                                        </div>
                                        {isActive && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute bottom-0 left-0 w-full h-0.5 bg-cyan-400 rounded-full"
                                                transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </div>

                    {/* Right side CTA / Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="text-slate-300 hover:text-white relative p-2 transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
                        </button>
                        <Link to="/report" className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_25px_rgba(6,182,212,0.5)]">
                            <PlusCircle size={16} />
                            <span>Quick Report</span>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
                        >
                            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Panel */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-slate-900 border-b border-white/10"
                    >
                        <div className="px-4 pt-2 pb-6 space-y-1">
                            {links.map((link) => (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    end={link.path === '/'}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium ${isActive
                                            ? 'bg-cyan-500/10 text-cyan-400'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                        }`
                                    }
                                >
                                    <link.icon size={18} />
                                    <span>{link.name}</span>
                                </NavLink>
                            ))}
                            <div className="pt-4 mt-2 border-t border-slate-800">
                                <Link
                                    to="/report"
                                    className="w-full flex justify-center items-center gap-2 bg-cyan-500 text-slate-900 px-4 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                                >
                                    <PlusCircle size={18} />
                                    <span>Start Quick Report</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.nav>
    )
}
