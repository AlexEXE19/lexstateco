import colors from "tailwindcss/colors";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantic aliases for the app's two accent colors and its dark
        // page-background scale. Everything in the app reads these names
        // instead of raw Tailwind colors, so the whole theme can be
        // re-skinned by editing this block alone (e.g. swap colors.blue
        // for colors.violet, or drop in a custom shade scale).
        primary: colors.blue,
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
