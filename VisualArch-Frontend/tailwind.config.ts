import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "bg-primary": "#1A1A2E",
        "bg-secondary": "#16213E",
        accent: "#5E81F4",
        "accent-glow": "#A78BFA",
        "text-primary": "#F0F4FF",
        "text-muted": "#8892B0",
      },
      fontFamily: {
        geist: ["var(--font-geist)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "spin-slow": "spin 3s linear infinite",
        "fade-in": "fadeIn 0.6s ease forwards",
        "slide-up": "slideUp 0.6s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "typewriter": "typewriter 2s steps(12) forwards",
        "cursor-blink": "cursorBlink 0.8s step-end infinite",
        "draw-line": "drawLine 1.2s ease forwards",
        "particle-drift": "particleDrift 8s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(94, 129, 244, 0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(167, 139, 250, 0.6)" },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        typewriter: {
          from: { width: "0" },
          to: { width: "100%" },
        },
        cursorBlink: {
          "0%, 100%": { borderColor: "transparent" },
          "50%": { borderColor: "#5E81F4" },
        },
        drawLine: {
          from: { width: "0%" },
          to: { width: "100%" },
        },
        particleDrift: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.4" },
          "33%": { transform: "translate(20px, -15px) scale(1.1)", opacity: "0.8" },
          "66%": { transform: "translate(-10px, 10px) scale(0.9)", opacity: "0.5" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
export default config;
