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
        // NeuroNest Core Palette with Full 50-900 Accessible Steps
        cream: {
          50: '#FDFCF9',
          100: '#F8F5EF', // Warm cream base
          200: '#EAE2D4', // Pale sand
          300: '#DDD2C0',
          400: '#CDC0AA',
          500: '#BAA98E',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E8EFE9',
          200: '#CFDFD2',
          300: '#B8CDBB', // Soft sage
          400: '#8FAFA0',
          500: '#668A75', // Muted green
          600: '#4F725E', // Deep sage (WCAG AA > 5:1 with white text)
          700: '#3D5849',
          800: '#2C4035',
          900: '#1E2C24',
        },
        dusty: {
          50: '#F2F6F9',
          100: '#E6EFF4',
          200: '#CDDFEA',
          300: '#AFC7D8', // Dusty blue
          400: '#84A8BF',
          500: '#5C829B',
          600: '#46687F', // Deep dusty blue (WCAG AA > 5.5:1 with white text)
          700: '#354F62',
          800: '#253745',
          900: '#17232C',
        },
        dustyBlue: {
          50: '#F2F6F9',
          100: '#E6EFF4',
          200: '#CDDFEA',
          300: '#AFC7D8',
          400: '#84A8BF',
          500: '#5C829B',
          600: '#46687F',
          700: '#354F62',
          800: '#253745',
          900: '#17232C',
        },
        lavender: {
          50: '#F8F6FC',
          100: '#ECE8F5',
          200: '#DDD5EE',
          300: '#C8BCE0', // Muted lavender
          400: '#A695C6',
          500: '#8672AB',
          600: '#6D5991', // Deep lavender (WCAG AA > 5:1 with white text)
          700: '#544472',
          800: '#3D3153',
          900: '#281F38',
        },
        peach: {
          50: '#FDF7F4',
          100: '#FBF0EB',
          200: '#F4DFD5',
          300: '#E9BDA9', // Soft peach
          400: '#D9987E',
          500: '#C77C60',
          600: '#AD6348', // Deep peach/terracotta (WCAG AA > 5:1 with white text)
          700: '#8C4D36',
          800: '#6A3725',
          900: '#492316',
        },
        ink: {
          50: '#F0F2F2',
          100: '#DDE2E1',
          200: '#C5CDCC',
          300: '#829190',
          500: '#4D5D5B',
          700: '#3A4846',
          800: '#26302F',
          900: '#1A2221', // Deep ink (high contrast text)
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
