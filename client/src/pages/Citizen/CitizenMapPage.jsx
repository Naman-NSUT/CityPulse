import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Map as MapIcon, Layers, Filter, X, Clock, AlertTriangle, CheckCircle, MapPin, Calendar } from 'lucide-react'
import { fetchIssues } from '../../lib/api'
import { format } from 'date-fns'

export default function CitizenMapPage() {
    // Refs for DOM and map instances
    const mapContainerRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const markersRef = useRef([])
    
    // State management
    const [mapLoaded, setMapLoaded] = useState(false)
    const [filter, setFilter] = useState('all')
    const [selectedIssue, setSelectedIssue] = useState(null)
    const [showDetailsPanel, setShowDetailsPanel] = useState(false)

    // Data fetching
    const { data: issues = [] } = useQuery({
        queryKey: ['issues'],
        queryFn: () => fetchIssues(),
    })

    // Calculate issue counts from the issues data
    const issueCounts = {
        all: issues.length,
        pending: issues.filter(i => i.status === 'pending').length,
        'in-progress': issues.filter(i => i.status === 'in-progress').length,
        resolved: issues.filter(i => i.status === 'resolved').length
    }

    // Cleanup markers function
    const cleanupMarkers = useCallback(() => {
        if (markersRef.current.length > 0) {
            markersRef.current.forEach(marker => {
                try {
                    if (marker && mapInstanceRef.current) {
                        mapInstanceRef.current.removeLayer(marker)
                    }
                } catch (error) {
                    console.warn('Error removing marker:', error)
                }
            })
            markersRef.current = []
        }
    }, [])

    // Map initialization effect
    useEffect(() => {
        let isMounted = true
        let cleanupTimer = null
        
        const initializeMap = async () => {
            // Prevent double initialization in React Strict Mode
            if (mapInstanceRef.current || !isMounted) {
                return
            }

            // Ensure container exists
            if (!mapContainerRef.current || !isMounted) {
                return
            }

            try {
                // Dynamic import of Leaflet
                const leafletModule = await import('leaflet')
                await import('leaflet/dist/leaflet.css')
                
                // Store L globally for access in other effects
                window.L = leafletModule.default

                // Small delay to ensure DOM is ready
                cleanupTimer = setTimeout(() => {
                    if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) {
                        return
                    }

                    try {
                        // Initialize map
                        const map = window.L.map(mapContainerRef.current, {
                            zoomControl: false,
                            preferCanvas: true
                        }).setView([28.6139, 77.2090], 12)

                        // Add tile layer
                        window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                            attribution: '© OpenStreetMap contributors',
                            maxZoom: 19,
                        }).addTo(map)

                        // Add zoom control
                        window.L.control.zoom({ position: 'bottomright' }).addTo(map)

                        // Store map instance if still mounted
                        if (isMounted) {
                            mapInstanceRef.current = map
                            setMapLoaded(true)
                        }
                    } catch (mapError) {
                        console.error('Map creation error:', mapError)
                    }
                }, 100)

            } catch (importError) {
                console.error('Leaflet import error:', importError)
            }
        }

        initializeMap()

        // Cleanup function
        return () => {
            isMounted = false
            
            // Clear any pending timer
            if (cleanupTimer) {
                clearTimeout(cleanupTimer)
            }
            
            // Cleanup markers
            cleanupMarkers()
            
            // Remove map instance
            if (mapInstanceRef.current) {
                try {
                    mapInstanceRef.current.remove()
                    mapInstanceRef.current.off()
                    mapInstanceRef.current = null
                } catch (error) {
                    console.warn('Map removal error:', error)
                }
            }
            
            setMapLoaded(false)
        }
    }, [cleanupMarkers])

    // Markers management effect
    useEffect(() => {
        // Add comprehensive null checks
        if (!mapInstanceRef.current || !mapLoaded || !window.L || !issues) {
            return
        }

        const map = mapInstanceRef.current
        if (!map) return

        // Cleanup existing markers
        cleanupMarkers()

        const severityColors = {
            critical: '#f43f5e',
            high: '#f59e0b',
            medium: '#22d3ee',
            low: '#10b981',
        }

        // Add null check for issues array
        if (!Array.isArray(issues)) {
            console.warn('Issues data is not an array:', issues)
            return
        }

        const filteredIssues = filter === 'all' ? issues : issues.filter(i => i.status === filter)

        // Add null check for filtered issues
        if (!Array.isArray(filteredIssues)) {
            console.warn('Filtered issues is not an array:', filteredIssues)
            return
        }

        // Create new markers
        const newMarkers = []
        
        filteredIssues?.forEach(issue => {
            if (issue.location?.lat && issue.location?.lng) {
                try {
                    const color = severityColors[issue.severity] || '#22d3ee'
                    const marker = window.L.circleMarker([issue.location.lat, issue.location.lng], {
                        radius: issue.severity === 'critical' ? 12 : issue.severity === 'high' ? 10 : 8,
                        fillColor: color,
                        color: color,
                        weight: 2,
                        opacity: 0.8,
                        fillOpacity: 0.3,
                    })
                    
                    // Add click handler
                    marker.on('click', () => {
                        setSelectedIssue(issue)
                        setShowDetailsPanel(true)
                    })
                    
                    // Add popup
                    marker.bindPopup(`
                        <div style="font-family: Inter, sans-serif; padding: 4px; color: #1e293b;">
                            <strong>${issue.title || issue.category}</strong><br/>
                            <span style="color: ${color}; text-transform: capitalize; font-weight: bold;">${issue.severity} severity</span><br/>
                            <small style="text-transform: capitalize; border-top: 1px solid #e2e8f0; display: block; margin-top: 4px; padding-top: 4px;">Status: ${issue.status}</small>
                        </div>
                    `)
                    
                    // Add to map and store reference
                    marker.addTo(map)
                    newMarkers.push(marker)
                } catch (error) {
                    console.warn('Error creating marker:', error)
                }
            }
        })

        // Store markers for cleanup
        markersRef.current = newMarkers

    }, [issues, mapLoaded, filter, cleanupMarkers])

    return (
        <div className="flex-grow flex flex-col p-4 sm:p-8">
            <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
                {/* Left Sidebar - Filters */}
                <div className="hidden lg:flex w-72 flex-col gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 h-full shadow-2xl flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <MapIcon className="text-cyan-400" size={24} />
                            <h2 className="text-xl font-bold text-white">Live Operations</h2>
                        </div>

                        <p className="text-sm text-slate-400 mb-8 border-b border-white/5 pb-6">
                            Visualize all civic anomalies reported by the community across the geographic layer in real-time.
                        </p>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-2 uppercase tracking-wide">
                                <Filter size={16} className="text-slate-500" /> Filters
                            </h3>
                            <button
                                onClick={() => setFilter('all')}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'all' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                All Active Incidents ({issueCounts.all})
                            </button>
                            <button
                                onClick={() => setFilter('pending')}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'pending' ? 'bg-amber-500/20 text-amber-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Recently Reported ({issueCounts.pending})
                            </button>
                            <button
                                onClick={() => setFilter('in-progress')}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'in-progress' ? 'bg-violet-500/20 text-violet-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                In-Progress fixes ({issueCounts['in-progress']})
                            </button>
                            <button
                                onClick={() => setFilter('resolved')}
                                className={`w-full text-left px-4 py-2 rounded-xl text-sm transition-colors ${filter === 'resolved' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-300 hover:bg-white/5'}`}
                            >
                                Completely Resolved ({issueCounts.resolved})
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Main Map */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-1 rounded-2xl overflow-hidden glass-card relative"
                >
                    <div ref={mapContainerRef} className="w-full h-full bg-slate-900" />

                    {/* Floating Overlay Mobile */}
                    <div className="absolute top-4 left-4 right-4 z-[1000] lg:hidden flex gap-2">
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="bg-slate-900/90 text-white rounded-xl border border-white/10 px-4 py-2 text-sm backdrop-blur-md focus:outline-none flex-1"
                        >
                            <option value="all">All Incidents ({issueCounts.all})</option>
                            <option value="pending">Recent ({issueCounts.pending})</option>
                            <option value="in-progress">In-Progress ({issueCounts['in-progress']})</option>
                            <option value="resolved">Resolved ({issueCounts.resolved})</option>
                        </select>
                    </div>
                </motion.div>

                {/* Map Legend */}
                <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-4 z-[1000]">
                    <h4 className="text-white font-semibold text-sm mb-3">Severity Legend</h4>
                    <div className="space-y-2">
                        {[
                            { color: '#f43f5e', label: 'Critical' },
                            { color: '#f59e0b', label: 'High' },
                            { color: '#22d3ee', label: 'Medium' },
                            { color: '#10b981', label: 'Low' }
                        ].map(item => (
                            <div key={item.label} className="flex items-center gap-2">
                                <div 
                                    className="w-4 h-4 rounded-full border-2 border-white/30"
                                    style={{ backgroundColor: item.color }}
                                />
                                <span className="text-slate-300 text-xs">{item.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Incident Details Panel */}
                <AnimatePresence>
                    {showDetailsPanel && selectedIssue && (
                        <motion.div
                            initial={{ x: 400, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 400, opacity: 0 }}
                            className="absolute right-0 top-0 bottom-0 w-96 bg-slate-900/95 backdrop-blur-md border-l border-white/10 z-[1000] overflow-hidden"
                        >
                            <div className="h-full flex flex-col">
                                {/* Header */}
                                <div className="bg-slate-800/80 border-b border-white/10 p-4 flex items-center justify-between">
                                    <h3 className="text-white font-semibold">Incident Details</h3>
                                    <button
                                        onClick={() => setShowDetailsPanel(false)}
                                        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Content */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                    {/* Image */}
                                    <div className="aspect-video w-full rounded-xl bg-slate-800 overflow-hidden">
                                        <img 
                                            src={`https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=400&h=200&fit=crop&auto=format`} 
                                            alt={selectedIssue.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Category & Severity */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-sm font-medium capitalize">
                                                {selectedIssue.category}
                                            </span>
                                        </div>
                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium capitalize ${
                                            selectedIssue.severity === 'critical' ? 'bg-red-500/20 text-red-400' :
                                            selectedIssue.severity === 'high' ? 'bg-orange-500/20 text-orange-400' :
                                            selectedIssue.severity === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-green-500/20 text-green-400'
                                        }`}>
                                            {selectedIssue.severity}
                                        </span>
                                    </div>

                                    {/* Title */}
                                    <h4 className="text-white text-lg font-semibold">
                                        {selectedIssue.title || `${selectedIssue.category} Issue`}
                                    </h4>

                                    {/* Description */}
                                    {selectedIssue.description && (
                                        <div className="bg-slate-800/60 rounded-lg p-3">
                                            <p className="text-slate-300 text-sm">{selectedIssue.description}</p>
                                        </div>
                                    )}

                                    {/* Location */}
                                    <div className="bg-slate-800/60 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                            <MapPin className="w-4 h-4" />
                                            Location
                                        </div>
                                        <p className="text-white text-sm">
                                            {selectedIssue.location?.address || 'Location not specified'}
                                        </p>
                                    </div>

                                    {/* Status */}
                                    <div className="bg-slate-800/60 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                                            {selectedIssue.status === 'resolved' ? (
                                                <CheckCircle className="w-4 h-4 text-green-400" />
                                            ) : selectedIssue.status === 'in-progress' ? (
                                                <AlertTriangle className="w-4 h-4 text-blue-400" />
                                            ) : (
                                                <Clock className="w-4 h-4 text-yellow-400" />
                                            )}
                                            Status
                                        </div>
                                        <p className="text-white text-sm capitalize">
                                            {selectedIssue.status.replace('-', ' ')}
                                        </p>
                                    </div>

                                    {/* Timeline */}
                                    <div className="bg-slate-800/60 rounded-lg p-3">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
                                            <Calendar className="w-4 h-4" />
                                            Timeline
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span className="text-slate-400">Reported</span>
                                                <span className="text-white">
                                                    {selectedIssue.createdAt ? format(new Date(selectedIssue.createdAt), 'MMM dd, yyyy') : 'Unknown'}
                                                </span>
                                            </div>
                                            {selectedIssue.status === 'in-progress' && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">In Progress</span>
                                                    <span className="text-blue-400">Active</span>
                                                </div>
                                            )}
                                            {selectedIssue.status === 'resolved' && (
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-400">Resolved</span>
                                                    <span className="text-green-400">Completed</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Issue ID */}
                                    <div className="bg-slate-800/60 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-slate-400 text-xs">Issue ID</span>
                                            <span className="text-cyan-400 font-mono text-xs">
                                                #{selectedIssue._id?.substring(0, 8).toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
