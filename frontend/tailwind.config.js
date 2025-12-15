/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Primary brand color from designs
        primary: {
          DEFAULT: '#ee4b2b',
          50: '#fff5f3',
          100: '#ffe9e4',
          200: '#ffd4cc',
          300: '#ffb3a3',
          400: '#ff7b5f',
          500: '#ee4b2b',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
        },
        // Secondary/accent colors
        secondary: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f5b400',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Neutral grays with warm undertone
        neutral: {
          50: '#faf8f8',
          100: '#f0eded',
          200: '#e0dcdc',
          300: '#c7c0c0',
          400: '#a69e9e',
          500: '#8a807f',
          600: '#6f6665',
          700: '#5a5252',
          800: '#3d3736',
          900: '#221a19',
        },
        // Semantic colors
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        // Background colors from designs
        'background-light': '#f8f6f6',
        'background-dark': '#221310',
        // App surfaces (used as bg-bg-*)
        bg: {
          primary: '#221310',
          secondary: '#2d1e19',
          tertiary: '#1a1210',
        },
        // Glass effect colors
        'glass-dark': 'rgba(30, 20, 18, 0.70)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-surface': 'rgba(255, 255, 255, 0.05)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      fontFamily: {
        display: ['var(--font-display)', 'var(--font-sans)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        sm: '0.25rem',
        md: '0.5rem',
        lg: '1rem',
        xl: '1.5rem',
        '2xl': '2rem',
        '3xl': '2.5rem',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '200ms',
        slow: '300ms',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(238, 75, 43, 0.4)',
        'glow-primary-lg': '0 0 40px rgba(238, 75, 43, 0.5)',
        'glow-secondary': '0 0 20px rgba(245, 180, 0, 0.35)',
        'glow-soft': '0 0 40px rgba(238, 75, 43, 0.15)',
        'card': '0 4px 30px rgba(0, 0, 0, 0.3)',
        'card-hover': '0 8px 40px rgba(0, 0, 0, 0.4)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'enterprise': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'liquid': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      keyframes: {
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-in-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(238, 75, 43, 0.4)' },
          '50%': { boxShadow: '0 0 40px rgba(238, 75, 43, 0.6)' },
        },
        'blob-bounce': {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(20px, -20px) scale(1.1)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'scan': {
          '0%, 100%': { top: '0%' },
          '50%': { top: '100%' },
        },
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease-in-out infinite',
        'slide-up': 'slide-up 0.4s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'scale-in': 'scale-in 0.3s ease-out forwards',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'blob-bounce': 'blob-bounce 10s ease-in-out alternate infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
