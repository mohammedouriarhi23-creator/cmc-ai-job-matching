/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Palette réelle de connect.cmcoriental.com : --primary:#3dabc4
        primary: {
          50: "#ebfbff",
          100: "#d4f0f5",
          200: "#a9e1ea",
          300: "#7dd2df",
          400: "#58bfd3",
          500: "#3dabc4",
          600: "#2f8ea3",
          700: "#257184",
          800: "#1a4a54",
          900: "#143a42",
          950: "#0d262c",
        },
        // Palette réelle : --danger:#bc0001 / --accent-red:#d7435b
        accent: {
          50: "#fdecee",
          100: "#fbd6da",
          200: "#f7aeb6",
          300: "#f18594",
          400: "#ea5b6f",
          500: "#d7435b",
          600: "#bc0001",
          700: "#8f0001",
          800: "#660001",
          900: "#400001",
        },
      },
      fontFamily: {
        sans: ["Nunito", "Segoe UI", "system-ui", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)" },
          "50%": { transform: "translate(0, -25px) rotate(6deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "50%": { transform: "translate(0, 20px) scale(1.05)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        "fade-up": "fade-up 0.7s ease-out forwards",
      },
    },
  },
  plugins: [],
}
