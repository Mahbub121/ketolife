/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        hind: ['Hind Siliguri', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#5B7F3F',
        bg: '#FAF6EE',
        accent: '#E8B647',
        warning: '#E97961',
        surface: '#FFFFFF',
        muted: 'rgba(41,38,27,0.5)',
        line: 'rgba(41,38,27,0.1)',
      },
    },
  },
  plugins: [],
}
