/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          900: "#2e1a0f",
          800: "#3d2314",
          700: "#5a3320",
        },
      },
    },
  },
  plugins: [],
}
