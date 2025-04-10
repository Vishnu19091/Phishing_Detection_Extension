/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./*.html", "./scripts/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        cust: "0.5rem 0.5rem 2rem rgba(0, 0, 0, 0.2)",
      },
      gridTemplateColumns: {
        cust: "auto auto",
        custh: "auto 5rem 5rem",
      },
      gridTemplateRows: {
        hero: "auto auto",
      },
      colors: {
        "bg-background": "hsl(var(--background)",
      },
    },
    screens: {
      mobile: "360px",
      lscreen: "980px",
      sdesktop: "1024px",

      desktop: "1280px",
      ldesktop: "1366px",
      xlarge: "1440px",
      mylap: "1536px",
    },
  },
  plugins: [],
};
