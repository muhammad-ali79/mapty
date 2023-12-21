/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "brand--1": "#ffb545",
        "brand--2": "#00c46a",
        "dark--1": "#2d3439",
        "dark--2": "#42484d",
        "light--1": "#aaa",
        "light--2": "#ececec",
        "light--3": "rgb(214, 222, 224)",
      },

      screens: {
        xs: "321px",
      },
    },
  },
  plugins: [],
};
