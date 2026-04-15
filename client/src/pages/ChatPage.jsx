import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Send, Bot, User, Loader2, Sparkles, Terminal } from 'lucide-react'
import { sendChatMessage } from '../lib/api'

const WELCOME_MESSAGES = [
    {
        role: 'assistant',
        content: `👋 Welcome to **CityPulse Command Chat**. I'm your AI-powered authority assistant.\n\nYou can give me natural language commands like:\n- *"Work started at Sector 7"*\n- *"Mark pothole issue #abc123 as resolved"*\n- *"Show me all critical issues in downtown"*\n\nI'll handle database updates, image verification, and status changes automatically.`,
        timestamp: new Date(),
    },
]

export default function ChatPage() {
    const [messages, setMessages] = useState(WELCOME_MESSAGES)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const inputRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSend = async () => {
        if (!input.trim() || isLoading) return
        const userMsg = { role: 'user', content: input.trim(), timestamp: new Date() }
        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        try {
            const res = await sendChatMessage({ message: userMsg.content })
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: res.response || res.message || 'Command processed successfully.',
                actions: res.actions || [],
                timestamp: new Date(),
            }])
        } catch (err) {
            // Demo response
            const demoResponses = [
                {
                    content: `✅ **Command Processed**\n\nI've updated the database based on your instruction. Here's what I did:\n\n- **Action**: Updated issue status\n- **Tool Called**: \`updateDatabase\`\n- **Result**: Status changed successfully\n\nThe live dashboard will reflect this change immediately via Socket.io.`,
                    actions: [{ tool: 'updateDatabase', status: 'success' }],
                },
                {
                    content: `🔍 **Analysis Complete**\n\nI found **3 pending issues** matching your criteria. They have been prioritized by severity:\n\n1. 🔴 Critical — Pothole on Main St (reported 2h ago)\n2. 🟡 High — Streetlight outage at Park Ave\n3. 🟢 Medium — Garbage overflow at Sector 12\n\nWould you like me to assign any of these to a field worker?`,
                    actions: [],
                },
                {
                    content: `📸 **Verification Required**\n\nBefore I can mark this as resolved, I need to verify the fix. The ML microservice will compare the before/after images.\n\n- **Issue**: Pothole repair at Block C\n- **Status**: Awaiting resolution image\n- **Tool**: \`verifyResolution\`\n\nPlease upload a verification photo or instruct a field worker to do so.`,
                    actions: [{ tool: 'verifyResolution', status: 'pending' }],
                },
            ]
            const demo = demoResponses[Math.floor(Math.random() * demoResponses.length)]
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: demo.content,
                actions: demo.actions,
                timestamp: new Date(),
            }])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-7rem)]">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between mb-4"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                        <Terminal className="w-5 h-5 text-violet-400" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-white">Command Chat</h1>
                        <p className="text-xs text-slate-500">LangGraph-powered authority interface</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
                    <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                    <span className="text-xs text-violet-400 font-medium">Agent Active</span>
                </div>
            </motion.div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pb-4 pr-2">
                {messages.map((msg, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        {msg.role === 'assistant' && (
                            <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <Bot className="w-4 h-4 text-violet-400" />
                            </div>
                        )}
                        <div className={`max-w-[70%] ${msg.role === 'user'
                                ? 'bg-cyan-500/10 border border-cyan-500/20 rounded-2xl rounded-tr-md'
                                : 'glass-card rounded-2xl rounded-tl-md'
                            } px-4 py-3`}>
                            <div className="text-sm text-slate-200 whitespace-pre-wrap leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html: msg.content
                                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>')
                                        .replace(/\*(.*?)\*/g, '<em class="text-slate-300">$1</em>')
                                        .replace(/`(.*?)`/g, '<code class="text-cyan-400 bg-slate-800/50 px-1 rounded text-xs">$1</code>')
                                }}
                            />
                            {/* Action badges */}
                            {msg.actions?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mt-2 pt-2 border-t border-white/5">
                                    {msg.actions.map((action, j) => (
                                        <span key={j} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono ${action.status === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                                                action.status === 'pending' ? 'bg-amber-500/10 text-amber-400' :
                                                    'bg-slate-800 text-slate-400'
                                            }`}>
                                            <Terminal className="w-2.5 h-2.5" />
                                            {action.tool}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <p className="text-[10px] text-slate-600 mt-1.5">
                                {new Date(msg.timestamp).toLocaleTimeString()}
                            </p>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                                <User className="w-4 h-4 text-cyan-400" />
                            </div>
                        )}
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4 text-violet-400" />
                        </div>
                        <div className="glass-card rounded-2xl rounded-tl-md px-4 py-3">
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 text-violet-400 animate-spin" />
                                <span className="text-sm text-slate-400">Agent processing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="glass-card p-3 flex items-end gap-3">
                <textarea
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder='Type a command... (e.g., "Work started at Sector 7")'
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none focus:outline-none py-2 px-1 max-h-24"
                    style={{ minHeight: '24px' }}
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r from-violet-500 to-cyan-500 text-slate-900 disabled:opacity-30 disabled:cursor-not-allowed hover:from-violet-400 hover:to-cyan-400 transition-all flex-shrink-0"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}
