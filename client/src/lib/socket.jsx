import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
    const socketRef = useRef(null)
    const [connected, setConnected] = useState(false)
    const [activities, setActivities] = useState([])
    const queryClient = useQueryClient()

    useEffect(() => {
        // Initialize socket only once
        if (socketRef.current) return

        const newSocket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
        })

        newSocket.on('connect', () => {
            setConnected(true)
            console.log('✅ [Socket] Connected:', newSocket.id)
        })

        newSocket.on('disconnect', () => {
            setConnected(false)
            console.log('❌ [Socket] Disconnected')
        })

        // Real-time issue events
        newSocket.on('issue:created', (issue) => {
            queryClient.invalidateQueries({ queryKey: ['issues'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
            setActivities(prev => [{
                id: Date.now(),
                type: 'created',
                message: `New ${issue.category || 'issue'} reported at ${issue.location?.address || 'unknown location'}`,
                timestamp: new Date(),
                severity: issue.severity,
            }, ...prev].slice(0, 50))
        })

        newSocket.on('issue:updated', (issue) => {
            queryClient.invalidateQueries({ queryKey: ['issues'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
            setActivities(prev => [{
                id: Date.now(),
                type: 'updated',
                message: `Issue #${issue._id?.slice(-6)} → ${issue.status}`,
                timestamp: new Date(),
                severity: issue.severity,
            }, ...prev].slice(0, 50))
        })

        newSocket.on('issue:resolved', (issue) => {
            queryClient.invalidateQueries({ queryKey: ['issues'] })
            queryClient.invalidateQueries({ queryKey: ['stats'] })
            setActivities(prev => [{
                id: Date.now(),
                type: 'resolved',
                message: `✓ Issue #${issue._id?.slice(-6)} resolved!`,
                timestamp: new Date(),
                severity: issue.severity,
            }, ...prev].slice(0, 50))
        })

        socketRef.current = newSocket

        // Cleanup only on full unmount
        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect()
                socketRef.current = null
            }
        }
    }, []) // Empty deps — initialize once, never reconnect on re-renders

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, connected, activities }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
