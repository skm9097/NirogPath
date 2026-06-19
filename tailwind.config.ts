import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1B6B4A",
          light: "#E8F5EE",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#2563EB",
          foreground: "#FFFFFF",
        },
        danger: "#DC2626",
        warning: "#F59E0B",
        success: "#16A34A",
        background: "#F8FAFC",
        surface: "#FFFFFF",
        border: "#E2E8F0",
        text: {
          primary: "#1E293B",
          secondary: "#64748B",
        },
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        inter: ["Inter", "sans-serif"],
        devanagari: ["Noto Sans Devanagari", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        lg: "12px",
        xl: "16px",
        "2xl": "20px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
