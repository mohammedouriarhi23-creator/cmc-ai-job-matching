/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cmc: {
          teal: "#2DB6C4",
          "teal-dark": "#1F8A96",
          navy: "#0F2B30",
          "navy-light": "#1A3A3F",
          crimson: "#E0303D",
          sky: "#EAF6FA",
        },
      },
      backgroundImage: {
        "cmc-hero": "linear-gradient(135deg, #0F2B30 0%, #14343A 45%, #1A3A3F 100%)",
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 43, 48, 0.09)",
      },
    },
  },
  plugins: [],
};
