import React from 'react'

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null, errorInfo: null }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo })
        console.error('🚨 ErrorBoundary caught:', error, errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    minHeight: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#070b14',
                    padding: '2rem',
                }}>
                    <div style={{
                        maxWidth: '480px',
                        width: '100%',
                        background: 'rgba(15, 23, 42, 0.8)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '1.5rem',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
                    }}>
                        <div style={{
                            width: '64px', height: '64px',
                            borderRadius: '50%',
                            background: 'rgba(239, 68, 68, 0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                            fontSize: '28px',
                        }}>
                            ⚠️
                        </div>
                        <h1 style={{
                            color: '#fff',
                            fontSize: '1.5rem',
                            fontWeight: 700,
                            marginBottom: '0.5rem',
                        }}>
                            Something went wrong
                        </h1>
                        <p style={{
                            color: '#94a3b8',
                            fontSize: '0.875rem',
                            marginBottom: '1.5rem',
                            lineHeight: 1.6,
                        }}>
                            {this.state.error?.message || 'An unexpected error occurred.'}
                        </p>
                        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => window.location.reload()}
                                style={{
                                    background: 'linear-gradient(to right, #06b6d4, #10b981)',
                                    color: '#0f172a',
                                    border: 'none',
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '9999px',
                                    fontWeight: 700,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Reload Page
                            </button>
                            <button
                                onClick={() => { window.location.href = '/' }}
                                style={{
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#e2e8f0',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '0.625rem 1.5rem',
                                    borderRadius: '9999px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem',
                                    cursor: 'pointer',
                                }}
                            >
                                Go Home
                            </button>
                        </div>
                        {this.state.errorInfo && (
                            <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
                                <summary style={{ color: '#64748b', fontSize: '0.75rem', cursor: 'pointer' }}>
                                    Technical Details
                                </summary>
                                <pre style={{
                                    color: '#f87171',
                                    fontSize: '0.7rem',
                                    marginTop: '0.5rem',
                                    padding: '1rem',
                                    background: 'rgba(0,0,0,0.3)',
                                    borderRadius: '0.75rem',
                                    overflow: 'auto',
                                    maxHeight: '200px',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}>
                                    {this.state.error?.toString()}
                                    {this.state.errorInfo?.componentStack}
                                </pre>
                            </details>
                        )}
                    </div>
                </div>
            )
        }
        return this.props.children
    }
}
