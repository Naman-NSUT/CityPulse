import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User, Search, MapPin, HelpCircle } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'

export default function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([
        {
            id: '1',
            type: 'bot',
            content: 'Hi! I\'m CityPulse AI assistant. I can help you track issues, find reports near you, and answer questions about city services. How can I assist you today?',
            timestamp: new Date()
        }
    ])
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const chatMutation = useMutation({
        mutationFn: async (message) => {
            const response = await fetch('http://localhost:8001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message,
                    issue_id: null
                })
            })
            if (!response.ok) {
                throw new Error('Failed to get response')
            }
            return response.json()
        },
        onSuccess: (data) => {
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'bot',
                content: data.response,
                timestamp: new Date(),
                actions: data.actions || []
            }])
        },
        onError: () => {
            // Fallback response for demo
            const fallbackResponses = [
                'I can help you track the status of your reports. Could you provide the issue ID?',
                'To find issues near you, please check the map page with your location enabled.',
                'You can report new issues by clicking the "Report Issue" button in the navigation.',
                'For broken streetlights, please include the pole number in your report for faster service.',
                'Pothole repairs typically take 24-48 hours depending on severity and weather conditions.'
            ]
            setMessages(prev => [...prev, {
                id: Date.now().toString(),
                type: 'bot',
                content: fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)],
                timestamp: new Date()
            }])
        }
    })

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isOpen])

    const handleSendMessage = () => {
        if (!inputValue.trim()) return

        const userMessage = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        chatMutation.mutate(inputValue)
        setInputValue('')
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const suggestedQuestions = [
        { icon: Search, text: 'What\'s the status of issue #69DED0?' },
        { icon: MapPin, text: 'How many potholes near me?' },
        { icon: HelpCircle, text: 'How do I report a broken streetlight?' }
    ]

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <>
            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 w-14 h-14 bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white rounded-full shadow-lg z-50 flex items-center justify-center"
            >
                <MessageCircle className="w-6 h-6" />
            </motion.button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 left-6 w-96 h-[600px] bg-slate-900 border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-cyan-500 to-emerald-500 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold">CityPulse Assistant</h3>
                                    <p className="text-white/80 text-xs">Always here to help</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {message.type === 'bot' && (
                                        <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-cyan-400" />
                                        </div>
                                    )}
                                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-first' : ''}`}>
                                        <div className={`rounded-2xl px-4 py-3 ${message.type === 'user'
                                                ? 'bg-gradient-to-r from-cyan-500 to-emerald-500 text-white'
                                                : 'bg-slate-800 text-slate-200'
                                            }`}>
                                            <p className="text-sm leading-relaxed">{message.content}</p>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1 px-2">
                                            {formatTime(message.timestamp)}
                                        </p>
                                    </div>
                                    {message.type === 'user' && (
                                        <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                            <User className="w-4 h-4 text-slate-300" />
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Typing Indicator */}
                            {chatMutation.isPending && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex gap-3 justify-start"
                                >
                                    <div className="w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-cyan-400" />
                                    </div>
                                    <div className="bg-slate-800 rounded-2xl px-4 py-3">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="px-4 py-3 border-t border-white/10">
                                <p className="text-slate-400 text-xs mb-2">Suggested questions:</p>
                                <div className="space-y-2">
                                    {suggestedQuestions.map((question, index) => {
                                        const Icon = question.icon
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => setInputValue(question.text)}
                                                className="w-full text-left bg-slate-800 hover:bg-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 hover:text-white transition-colors flex items-center gap-2"
                                            >
                                                <Icon className="w-3 h-3" />
                                                {question.text}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t border-white/10">
                            <div className="flex gap-2">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about CityPulse..."
                                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
                                    disabled={chatMutation.isPending}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || chatMutation.isPending}
                                    className="bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
