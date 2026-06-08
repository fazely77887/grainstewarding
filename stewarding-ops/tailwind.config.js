/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bg: "#050a16",
        panel: "#0a1124",
        "panel-2": "#0d1530",
        "panel-3": "#121b3a",
        sidebar: "#070c1a",
        line: "rgba(148,163,184,0.10)",
        "line-soft": "rgba(148,163,184,0.06)",
        ink: "#e8edf7",
        muted: "#8b97ad",
        faint: "#5b6880",
        accent: "#2f6bff",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        card: "0 18px 45px -18px rgba(0,0,0,0.65)",
        pop: "0 0 0 1px rgba(148,163,184,0.08), 0 28px 70px -28px rgba(0,0,0,0.85)",
      },
      keyframes: {
        slideIn: { from: { transform: "translateX(48px)", opacity: "0" }, to: { transform: "translateX(0)", opacity: "1" } },
        fadeUp: { from: { transform: "translateY(10px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
      },
      animation: {
        slideIn: "slideIn .28s cubic-bezier(.2,.8,.2,1)",
        fadeUp: "fadeUp .35s cubic-bezier(.2,.8,.2,1) both",
      },
    },
  },
  plugins: [],
};
