/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1360px',
      },
    },
    extend: {
      colors: {
        // NeuroNest Core Palette
        cream: {
          50: '#FDFCF9',
          100: '#F8F5EF', // Warm cream base
          200: '#EAE2D4', // Pale sand
          300: '#DDD2C0',
        },
        sage: {
          100: '#E8EFE9',
          200: '#CFDFD2',
          300: '#B8CDBB', // Soft sage
          500: '#668A75', // Muted green
          700: '#456152',
        },
        lavender: {
          100: '#ECE8F5',
          200: '#DDD5EE',
          300: '#C8BCE0', // Muted lavender
          500: '#8672AB',
        },
        dustyBlue: {
          100: '#E6EFF4',
          200: '#CDDFEA',
          300: '#AFC7D8', // Dusty blue
          500: '#5C829B',
        },
        peach: {
          100: '#FBF0EB',
          200: '#F4DFD5',
          300: '#E9BDA9', // Soft peach
          500: '#C77C60',
        },
        ink: {
          50: '#F0F2F2',
          100: '#DDE2E1',
          300: '#829190',
          500: '#4D5D5B',
          900: '#303B3A', // Deep ink (high contrast text)
        },
        // Semantic aliases
        background: 'var(--color-bg)',
        foreground: 'var(--color-text)',
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-text)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-text)',
        },
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-text)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-text)',
        },
        card: {
          DEFAULT: 'var(--color-card)',
          foreground: 'var(--color-card-text)',
        },
        border: 'var(--color-border)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['"Nunito Sans"', 'system-ui', 'sans-serif'],
        reading: ['"Atkinson Hyperlegible"', 'Georgia', 'sans-serif'],
        dyslexic: ['"OpenDyslexic"', 'Comic Sans MS', 'sans-serif'],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.85 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-subtle": "pulse-subtle 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
}
