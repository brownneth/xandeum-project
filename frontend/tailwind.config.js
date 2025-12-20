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
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
      colors: {
        carbon: {
          100: '#161616', 
          90:  '#262626', 
          80:  '#393939', 
          70:  '#525252', 
          60:  '#6f6f6f', 
          30:  '#c6c6c6', 
          10:  '#f4f4f4', 
          white: '#ffffff',
        },
        
        status: {
          success: '#42be65',
          warning: '#f1c21b',
          error:   '#da1e28',
          info:    '#4589ff',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(5px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [],
}