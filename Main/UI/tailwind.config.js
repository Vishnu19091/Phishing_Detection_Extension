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
      xsml: "360px",
      mobile: "640px",
      tablet: "768px",
      lscreen: "980px",

      desktop: "1024px",
      ldesktop: "1280px",

      xlarge: "1440px",
      mylap: "1536px",
    },
  },
  plugins: [],
};
