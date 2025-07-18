/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],
  theme: {
    extend: {
      colors: {
        // Bedwars theme colors
        'bedwars': {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        'gaming': {
          dark: '#0a0a0a',
          darker: '#050505',
          accent: '#ff6b35',
          secondary: '#4ecdc4',
          highlight: '#45b7d1',
          danger: '#ff4757',
          success: '#2ed573',
          warning: '#ffa502',
        }
      },
      fontFamily: {
        'gaming': ['Orbitron', 'monospace'],
        'minecraft': ['Minecraft', 'monospace'],
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite alternate',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px theme(colors.gaming.accent)' },
          '100%': { boxShadow: '0 0 20px theme(colors.gaming.accent)' },
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'bedwars-gradient': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gaming-gradient': 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
      }
    },
  },
  plugins: [],
}