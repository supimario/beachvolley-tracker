// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        body: ['"Poppins"', 'sans-serif'],
        heading: ['"Pacifico"', 'cursive'], // fun, beachy look
      },
      backgroundImage: {
        'beach-gradient': 'linear-gradient(to right, #fbd786, #f7797d)', // soft sand to sunset
      },
      colors: {
        sand: '#fceabb',
        ocean: '#00c6ff',
        coral: '#f7797d',
      },
    },
  },
  plugins: [],
}
