/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        bg: {
          primary: '#0f0f1a',
          secondary: '#1a1a2e',
          tertiary: '#16213e',
        },
        neon: {
          pink: '#ff2a6d',
          cyan: '#05d9e8',
          purple: '#d300c5',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 33s linear infinite',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'bounce-smooth': 'bounceSmooth 0.6s ease-out',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(255, 42, 109, 0.5)' },
          '50%': { boxShadow: '0 0 40px rgba(255, 42, 109, 0.8), 0 0 60px rgba(5, 217, 232, 0.4)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bounceSmooth: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
};
