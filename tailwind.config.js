/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{html,js}"
  ],
  theme: {
    extend: {
      colors: {
        'lichtara-gold': '#D4AF37',
        'lichtara-blue': '#4A90E2', 
        'lichtara-silver': '#C0C0C0',
        'cosmic-black': '#1a1a2e'
      }
    },
  },
  plugins: [],
}