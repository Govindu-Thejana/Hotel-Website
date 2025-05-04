/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        sm: "480px",  // Mobile
        md: "768px",  // Tablet
        lg: "1024px", // Laptop
        xl: "1440px", // Desktop
        "2xl": "1920px", // Large screens
      },
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
