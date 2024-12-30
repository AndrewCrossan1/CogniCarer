/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
    screens: {
      // Define custom breakpoints for mobile apps
      xs: "296px",
      sm: "320px",
      md: "344px",
      lg: "368px",
      xl: "392px",
    }
  },
  plugins: [],
}

