import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F7F3EC',
          50: '#FBF9F4',
          100: '#F7F3EC',
          200: '#EEE7DA',
          300: '#E0D5C0',
        },
        ink: {
          DEFAULT: '#1A1613',
          900: '#1A1613',
          800: '#2A241F',
          700: '#3D352E',
          600: '#564A40',
          500: '#746557',
          400: '#9A8A79',
          300: '#BFB2A1',
          200: '#DDD3C2',
          100: '#EDE6D8',
        },
        terracotta: {
          DEFAULT: '#B8522D',
          50: '#FAEFE9',
          100: '#F4DDD0',
          400: '#CC6F4A',
          500: '#B8522D',
          600: '#9D4225',
          700: '#7A3319',
        },
        sage: {
          DEFAULT: '#6B7A5C',
          500: '#6B7A5C',
          600: '#556349',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['"Inter Tight"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 8vw, 6.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em', fontWeight: '350' }],
        'display-lg': ['clamp(2.5rem, 5vw, 4rem)', { lineHeight: '1.02', letterSpacing: '-0.025em', fontWeight: '350' }],
        'display-md': ['clamp(1.75rem, 3vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '400' }],
        'eyebrow': ['0.68rem', { lineHeight: '1', letterSpacing: '0.22em', fontWeight: '500' }],
      },
      maxWidth: {
        'reading': '62ch',
        'container': '1280px',
      },
      spacing: {
        'section': 'clamp(4rem, 10vw, 9rem)',
      },
      animation: {
        'fade-up': 'fadeUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 1.2s ease-out both',
        'width-in': 'widthIn 1.4s cubic-bezier(0.16, 1, 0.3, 1) both',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        widthIn: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
