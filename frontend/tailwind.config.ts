import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy:    "#0C0A40",
        violet:  "#512DB9",
        rouge:   "#F22222",
        rose:    "#F28DB2",
        lavande: "#E7D5F2",
        pierre:  "#8B7A68",   // warm stone — remplace or/gold
        creme:   "#F5F0E8",
      },
      fontFamily: {
        display: ["var(--font-syne)",     "system-ui", "sans-serif"],
        serif:   ["var(--font-playfair)", "Georgia",   "serif"],
        sans:    ["var(--font-inter)",    "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":  "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "fade-up":     "fadeUp 0.7s ease forwards",
        "fade-left":   "fadeLeft 0.7s ease forwards",
        "fade-right":  "fadeRight 0.7s ease forwards",
        "float":       "float 6s ease-in-out infinite",
        "float-slow":  "float 9s ease-in-out infinite",
        "glow-pulse":  "glowPulse 3s ease-in-out infinite",
        "line-grow":   "lineGrow 1.5s ease forwards",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(32px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeLeft: {
          from: { opacity: "0", transform: "translateX(-40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          from: { opacity: "0", transform: "translateX(40px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%":     { transform: "translateY(-14px)" },
        },
        glowPulse: {
          "0%,100%": { boxShadow: "0 0 20px rgba(81,45,185,0.25), 0 0 40px rgba(242,34,34,0.1)" },
          "50%":     { boxShadow: "0 0 40px rgba(81,45,185,0.5),  0 0 80px rgba(242,34,34,0.2)" },
        },
        lineGrow: {
          from: { transform: "scaleY(0)", transformOrigin: "top" },
          to:   { transform: "scaleY(1)", transformOrigin: "top" },
        },
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
