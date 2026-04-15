import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useQueryClient } from '@tanstack/react-query'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
    const [socket, setSocket] = useState(null)
    const [connected, setConnected] = useState(false)
    const [activities, setActivities] = useState([])
    const queryClient = useQueryClient()

    useEffect(() => {
        const newSocket = io('http://localhost:5000', {
            transports: ['websocket', 'polling'],
        })

        newSocket.on('connect', () => {
            setConnected(true)
            console.log('[Socket] Connected')
        })

        newSocket.on('disconnect', () => {
            setConnected(false)
            console.log('[Socket] Disconnected')
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

        setSocket(newSocket)
        return () => newSocket.close()
    }, [queryClient])

    return (
        <SocketContext.Provider value={{ socket, connected, activities }}>
            {children}
        </SocketContext.Provider>
    )
}

export const useSocket = () => useContext(SocketContext)
