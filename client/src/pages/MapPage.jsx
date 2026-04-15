import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Map as MapIcon, Layers, Filter } from 'lucide-react'
import { fetchIssues } from '../lib/api'

export default function MapPage() {
    const mapRef = useRef(null)
    const mapInstanceRef = useRef(null)
    const [mapLoaded, setMapLoaded] = useState(false)

    const { data: issues = [] } = useQuery({
        queryKey: ['issues'],
        queryFn: () => fetchIssues(),
    })

    useEffect(() => {
        // Dynamically import Leaflet
        const loadMap = async () => {
            if (mapInstanceRef.current) return

            const L = await import('leaflet')
            await import('leaflet/dist/leaflet.css')

            const map = L.map(mapRef.current, {
                zoomControl: false,
            }).setView([28.6139, 77.2090], 12)

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map)

            L.control.zoom({ position: 'bottomright' }).addTo(map)

            mapInstanceRef.current = map
            setMapLoaded(true)
        }

        loadMap()

        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove()
                mapInstanceRef.current = null
            }
        }
    }, [])

    // Add markers when issues change
    useEffect(() => {
        if (!mapInstanceRef.current || !mapLoaded) return
        const L = window.L || require('leaflet')
        const map = mapInstanceRef.current

        // Clear existing markers
        map.eachLayer(layer => {
            if (layer instanceof L.CircleMarker) {
                map.removeLayer(layer)
            }
        })

        const severityColors = {
            critical: '#f43f5e',
            high: '#f59e0b',
            medium: '#22d3ee',
            low: '#10b981',
        }

        issues.forEach(issue => {
            if (issue.location?.lat && issue.location?.lng) {
                const color = severityColors[issue.severity] || '#22d3ee'
                L.circleMarker([issue.location.lat, issue.location.lng], {
                    radius: issue.severity === 'critical' ? 12 : issue.severity === 'high' ? 10 : 8,
                    fillColor: color,
                    color: color,
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.3,
                }).addTo(map).bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <strong>${issue.title || issue.category}</strong><br/>
            <span style="color: ${color}; text-transform: capitalize;">${issue.severity} severity</span><br/>
            <small>${issue.status}</small>
          </div>
        `)
            }
        })

        // Add some demo markers if no issues
        if (issues.length === 0) {
            const demoPoints = [
                { lat: 28.6139, lng: 77.2090, title: 'Pothole', severity: 'high', status: 'pending' },
                { lat: 28.6280, lng: 77.2195, title: 'Streetlight', severity: 'medium', status: 'in-progress' },
                { lat: 28.6025, lng: 77.2310, title: 'Garbage', severity: 'low', status: 'resolved' },
                { lat: 28.6350, lng: 77.1950, title: 'Water leak', severity: 'critical', status: 'pending' },
                { lat: 28.5950, lng: 77.2150, title: 'Road damage', severity: 'high', status: 'in-progress' },
            ]
            demoPoints.forEach(pt => {
                const color = severityColors[pt.severity]
                L.circleMarker([pt.lat, pt.lng], {
                    radius: pt.severity === 'critical' ? 12 : pt.severity === 'high' ? 10 : 8,
                    fillColor: color,
                    color: color,
                    weight: 2,
                    opacity: 0.8,
                    fillOpacity: 0.3,
                }).addTo(map).bindPopup(`
          <div style="font-family: Inter, sans-serif; padding: 4px;">
            <strong>${pt.title}</strong><br/>
            <span style="color: ${color}; text-transform: capitalize;">${pt.severity}</span><br/>
            <small>${pt.status}</small>
          </div>
        `)
            })
        }
    }, [issues, mapLoaded])

    return (
        <div className="h-[calc(100vh-7rem)] flex flex-col gap-4">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <MapIcon className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Global Impact Map</h1>
                        <p className="text-xs text-slate-500">Geo-spatial issue visualization</p>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4">
                    {[
                        { color: 'bg-rose-400', label: 'Critical' },
                        { color: 'bg-amber-400', label: 'High' },
                        { color: 'bg-cyan-400', label: 'Medium' },
                        { color: 'bg-emerald-400', label: 'Low' },
                    ].map(item => (
                        <div key={item.label} className="flex items-center gap-1.5">
                            <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                            <span className="text-[11px] text-slate-400">{item.label}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Map Container */}
            <div className="flex-1 glass-card overflow-hidden relative">
                <div ref={mapRef} className="w-full h-full rounded-2xl" />

                {/* Overlay stats */}
                <div className="absolute bottom-4 left-4 z-[1000] glass-card px-4 py-3 flex items-center gap-4">
                    <div className="text-center">
                        <p className="text-lg font-bold text-white">{issues.length || 5}</p>
                        <p className="text-[10px] text-slate-500 uppercase">Active</p>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                        <p className="text-lg font-bold text-emerald-400">
                            {issues.filter(i => i.status === 'resolved').length || 0}
                        </p>
                        <p className="text-[10px] text-slate-500 uppercase">Resolved</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
