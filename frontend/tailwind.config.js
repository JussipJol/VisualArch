/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0D0E1A',
        surface: '#16213E',
        'surface-2': '#1E2A45',
        accent: '#5E81F4',
        'accent-2': '#22D3EE',
        success: '#4ADE80',
        warning: '#FACC15',
        danger: '#F87171',
        purple: '#A78BFA',
        'text-primary': '#EAEEFF',
        'text-secondary': '#8B8FA8',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      boxShadow: {
        card: '0 4px 24px rgba(0,0,0,0.35)',
        'glow-accent': '0 0 20px rgba(94,129,244,0.3)',
        'glow-cyan': '0 0 20px rgba(34,211,238,0.3)',
        'glow-green': '0 0 20px rgba(74,222,128,0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'counter': 'counter 0.8s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 10px rgba(94,129,244,0.2)' }, '50%': { boxShadow: '0 0 25px rgba(94,129,244,0.5)' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(94,129,244,0.15) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(135deg, rgba(30,42,69,0.8) 0%, rgba(22,33,62,0.4) 100%)',
      },
    },
  },
  plugins: [],
};
