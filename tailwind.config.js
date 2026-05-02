/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          900: '#050505',
          800: '#111111',
          700: '#1a1a1a',
          600: '#2a2a2a',
        },
        brand: {
          purple: '#9d4edd',
          pink: '#f15bb5',
          green: '#00f5d4',
          accent: '#7b2cbf',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-glow': 'conic-gradient(from 180deg at 50% 50%, #7b2cbf44 0deg, #9d4edd44 180deg, #050505 180deg, #050505 360deg)',
      }
    },
  },
  plugins: [],
}
