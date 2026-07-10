/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#29abe2",
        primary: "#253c7d",
        "ops-blue": "#253c7d",
        "ops-sky": "#29abe2",
        "ops-gray": "#434143",
        "dc-text": "rgb(var(--dc-text) / <alpha-value>)",
        "dc-bg": "rgb(var(--dc-bg) / <alpha-value>)",
        "dc-surface": "rgb(var(--dc-surface) / <alpha-value>)",
        "dc-card": "rgb(var(--dc-card) / <alpha-value>)",
        "dc-input": "rgb(var(--dc-input) / <alpha-value>)",
        dark: {
          900: "#080d1a",
          800: "#0c1426",
          700: "#0f1c36",
          600: "#152542",
          500: "#1c3059",
        },
      },
      fontFamily: {
        grotesk: ["Source Sans 3", "sans-serif"],
        mono: ["Space Mono", "monospace"],
        khmer: ["Noto Sans Khmer", "sans-serif"],
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