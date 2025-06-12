/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sand: '#FEF9EF',
        seafoam: '#B6EADA',
        coral: '#FF8BA7',
        ocean: '#255C69',
        sunset: '#FFD6A5',
      },
      fontFamily: {
        heading: ['Quicksand', 'sans-serif'],
        body: ['Quicksand', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
