/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Warm paper-like canvas rather than pure white - reads calmer and
        // lets photography carry the page.
        canvas: "#FBFAF8",
        background: {
          DEFAULT: "#FBFAF8",
          surface: "#FFFFFF",
          elevated: "#F5F3EF",
          muted: "#EFECE6",
        },
        ink: {
          DEFAULT: "#171716",
          muted: "#57564F",
          subtle: "#8A887F",
          inverse: "#FBFAF8",
        },
        line: {
          DEFAULT: "#E5E1D9",
          strong: "#D2CCC0",
        },
        // Deep evergreen: the trust/estate colour, used sparingly.
        primary: {
          50: "#F1F5F2",
          100: "#DCE7DF",
          200: "#B9CFC0",
          300: "#8FB09B",
          400: "#5F8B70",
          500: "#3E6E51",
          600: "#2E5940",
          700: "#254733",
          800: "#1E3A2A",
          900: "#16291F",
        },
        // Warm clay, for prices and small moments of emphasis.
        secondary: {
          50: "#FBF4EE",
          100: "#F3E3D5",
          200: "#E5C5A9",
          300: "#D3A177",
          400: "#C0834F",
          500: "#A96A38",
          600: "#8C532B",
          700: "#6F4124",
          800: "#553321",
          900: "#3C251A",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "sans-serif",
        ],
        display: ["Fraunces", "Iowan Old Style", "Georgia", "serif"],
      },
      fontSize: {
        "display-sm": ["2rem", { lineHeight: "1.12", letterSpacing: "-0.02em" }],
        "display-md": ["2.75rem", { lineHeight: "1.06", letterSpacing: "-0.02em" }],
        "display-lg": ["3.75rem", { lineHeight: "1.02", letterSpacing: "-0.025em" }],
      },
      // Deliberately tight - large pill-shaped everything is the giveaway of
      // a generated layout. Even stray `rounded-3xl` stays restrained here.
      borderRadius: {
        none: "0px",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
        xl: "8px",
        "2xl": "10px",
        "3xl": "12px",
        full: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(23,23,22,0.04), 0 1px 3px rgba(23,23,22,0.05)",
        lift: "0 6px 16px rgba(23,23,22,0.08), 0 2px 4px rgba(23,23,22,0.04)",
        panel: "0 12px 40px rgba(23,23,22,0.12)",
      },
      letterSpacing: {
        label: "0.14em",
      },
    },
  },
  plugins: [],
};
