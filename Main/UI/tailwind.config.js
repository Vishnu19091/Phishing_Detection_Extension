/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        cust: "0.5rem 0.5rem 2rem rgba(0, 0, 0, 0.2)",
      },
      gridTemplateColumns: {
        cust: "auto auto",
      },
    },
  },
  plugins: [],
};
