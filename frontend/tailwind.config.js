/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pcolor: '#2D2C2C',
        scolor: '#BF9766',
        acolor: '#F3EDE6',
        bgcolor: '#f5f5f5',
      },
    },
  },
  plugins: [],
}

