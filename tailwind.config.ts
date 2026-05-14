/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#b9ff4b",
        "dc-text": "rgb(var(--dc-text) / <alpha-value>)",
        "dc-bg": "rgb(var(--dc-bg) / <alpha-value>)",
        "dc-surface": "rgb(var(--dc-surface) / <alpha-value>)",
        "dc-card": "rgb(var(--dc-card) / <alpha-value>)",
        "dc-input": "rgb(var(--dc-input) / <alpha-value>)",
        dark: {
          900: "#0b0a08",
          800: "#110f0d",
          700: "#161310",
          600: "#1e1a14",
          500: "#2a2520",
        },
      },
      fontFamily: {
        grotesk: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 1s ease forwards",
        "spin-slow": "spin 12s linear infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};