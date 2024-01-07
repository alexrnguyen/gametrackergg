/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    colors: {
      black: "#000000",
      white: "#ffffff",
      grey: "#555",
      lightgrey: "#777"
    },
    extend: {
        gridTemplateColumns: {
          'auto-fill-200': 'repeat(auto-fill, minmax(200px, 1fr))',
        },
    },
  },
  variants: {
    backgroundColor: ['active', 'hover']
  },
  plugins: [],
}

