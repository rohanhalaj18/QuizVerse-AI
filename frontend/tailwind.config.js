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
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#ff6b00',
          light: '#ffa353',
          dark: '#cc4b00',
        },
        secondary: '#ff9100',
        accent: '#06b6d4',
      },
    },
  },
  plugins: [],
}
