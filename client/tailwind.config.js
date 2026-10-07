/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bridge: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#36a8f6',
          500: '#0c8de7',
          600: '#026fc5',
          700: '#03589f',
          800: '#074b83',
          900: '#0c3f6d',
          950: '#072849'
        },
        // WCAG AAA High Contrast Theme tokens
        aaa: {
          bg: '#000000',
          card: '#121212',
          text: '#ffffff',
          yellow: '#ffff00',
          cyan: '#00ffff',
          green: '#00ff66',
          border: '#ffffff'
        },
        warm: {
          bg: '#fbf0d9',
          card: '#f4e5c3',
          text: '#2d251e',
          border: '#c2b08a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        dyslexic: ['OpenDyslexic', 'Comic Sans MS', 'Trebuchet MS', 'sans-serif'],
        reading: ['Atkinson Hyperlegible', 'Verdana', 'sans-serif']
      },
      fontSize: {
        'accessible-sm': ['1rem', '1.6'],
        'accessible-base': ['1.125rem', '1.75'],
        'accessible-lg': ['1.25rem', '1.8'],
        'accessible-xl': ['1.5rem', '1.9'],
        'accessible-2xl': ['1.875rem', '2.0'],
        'accessible-3xl': ['2.25rem', '2.2']
      }
    },
  },
  plugins: [],
}
