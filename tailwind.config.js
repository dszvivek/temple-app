/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  // Safelist dynamic classes used in deity configs (applied via JS, not found in templates by Tailwind scanner)
  safelist: [
    // Gradient direction
    'bg-gradient-to-b',
    // Hanuman gradients (orange theme)
    'from-orange-200', 'via-pink-100', 'to-yellow-50',
    'from-red-100', 'via-orange-50', 'to-white',
    'from-orange-400', 'via-pink-200', 'to-purple-100',
    'from-orange-900', 'via-red-900', 'to-gray-900',
    // Ganesh gradients (red/orange theme)
    'from-red-200', 'via-orange-100',
    'from-amber-100', 'via-yellow-50',
    'from-red-400', 'via-orange-200', 'to-yellow-100',
    'from-red-900', 'via-orange-900',
    // Shiva gradients (blue/indigo theme)
    'from-blue-200', 'via-indigo-100', 'to-purple-50',
    'from-blue-100', 'via-indigo-50',
    'from-indigo-400', 'via-purple-200', 'to-pink-100',
    'from-indigo-900', 'via-purple-900',
    // Krishna gradients (blue/cyan theme)
    'from-blue-300', 'via-cyan-100',
    'from-sky-100', 'via-blue-50',
    'from-blue-400', 'to-orange-100',
    'from-blue-900', 'via-indigo-900',
    // Durga gradients (red/pink theme)
    'via-pink-50', 'to-orange-50',
    'from-red-100',
    'to-orange-100',
    'via-pink-900',
    // Common
    'to-white', 'to-gray-900',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#631d0f',
        },
        temple: {
          dark: '#1a0f0a',
          gold: '#d4af37',
          red: '#8b0000',
          'gold-light': '#f4e5b5',
          'red-light': '#dc2626',
          'dark-soft': '#2d1810',
        },
        spiritual: {
          lotus: '#fecdd3',
          marigold: '#fbbf24',
          sandalwood: '#f5deb3',
          turmeric: '#fbbf24',
          sindoor: '#ef4444',
          vermillion: '#e53935',
          incense: '#8d6e63',
          ghee: '#fff8dc',
          camphor: '#e3f2fd',
          rudraksha: '#5d4037',
        },
        // Gamification colors
        reward: {
          bronze: '#cd7f32',
          silver: '#c0c0c0',
          gold: '#ffd700',
          platinum: '#e5e4e2',
          diamond: '#b9f2ff',
        }
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        hindi: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'float-delayed': 'float 3s ease-in-out 0.5s infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scale-in': 'scaleIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      boxShadow: {
        'soft': '0 2px 15px rgba(0, 0, 0, 0.08)',
        'soft-lg': '0 10px 40px rgba(0, 0, 0, 0.12)',
        'glow-saffron': '0 0 20px rgba(249, 115, 22, 0.4)',
        'glow-gold': '0 0 30px rgba(212, 175, 55, 0.5)',
        'inner-soft': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
