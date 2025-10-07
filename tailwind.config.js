/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        text: "#0B132B",
        bg: "#F8F9FA",
        surface: "#EDEFF2",
        border: "#D9DCE1",
        brand: "#1D3D91",
      },
    },
  },
  plugins: [],
};
