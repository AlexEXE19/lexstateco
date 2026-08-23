import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: colors.indigo,
        secondary: colors.sky,
        background: {
          DEFAULT: colors.slate[950],
          surface: colors.slate[900],
          elevated: colors.slate[800],
          muted: colors.slate[700],
        },
      },
    },
  },
  plugins: [],
};