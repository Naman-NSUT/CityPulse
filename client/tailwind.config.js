/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                display: ['Inter', 'system-ui', 'sans-serif'],
            },
            colors: {
                brand: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    300: '#6ee7b7',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                accent: {
                    cyan: '#22d3ee',
                    violet: '#8b5cf6',
                    amber: '#f59e0b',
                    rose: '#f43f5e',
                },
                glass: {
                    light: 'rgba(255, 255, 255, 0.05)',
                    medium: 'rgba(255, 255, 255, 0.08)',
                    heavy: 'rgba(255, 255, 255, 0.12)',
                    border: 'rgba(255, 255, 255, 0.10)',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'glow-cyan': 'radial-gradient(ellipse at center, rgba(34,211,238,0.15) 0%, transparent 70%)',
                'glow-violet': 'radial-gradient(ellipse at center, rgba(139,92,246,0.15) 0%, transparent 70%)',
                'glow-emerald': 'radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, transparent 70%)',
            },
            boxShadow: {
                'glow-sm': '0 0 15px rgba(34, 211, 238, 0.15)',
                'glow-md': '0 0 30px rgba(34, 211, 238, 0.2)',
                'glow-lg': '0 0 60px rgba(34, 211, 238, 0.25)',
                'glow-violet': '0 0 30px rgba(139, 92, 246, 0.2)',
                'glow-emerald': '0 0 30px rgba(16, 185, 129, 0.2)',
                'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
            },
            animation: {
                'fade-in': 'fadeIn 0.5s ease-out forwards',
                'slide-up': 'slideUp 0.5s ease-out forwards',
                'slide-right': 'slideRight 0.4s ease-out forwards',
                'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
                'ticker': 'ticker 30s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideRight: {
                    '0%': { opacity: '0', transform: 'translateX(-20px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                pulseGlow: {
                    '0%, 100%': { boxShadow: '0 0 15px rgba(34, 211, 238, 0.15)' },
                    '50%': { boxShadow: '0 0 30px rgba(34, 211, 238, 0.3)' },
                },
                ticker: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
        },
    },
    plugins: [],
}
