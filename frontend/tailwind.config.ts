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
        primary: "#cc785c",
        "primary-active": "#a9583e",
        "primary-disabled": "#e6dfd8",
        ink: "#141413",
        body: "#3d3d3a",
        "body-strong": "#252523",
        muted: "#6c6a64",
        "muted-soft": "#8e8b82",
        hairline: "#e6dfd8",
        canvas: "#faf9f5",
        "surface-soft": "#f5f0e8",
        "surface-card": "#efe9de",
        "surface-dark": "#181715",
        "surface-dark-elevated": "#252320",
        "on-dark": "#faf9f5",
        "on-dark-soft": "#a09d96",
        "accent-teal": "#5db8a6",
        success: "#5db872",
        warning: "#d4a017",
        error: "#c64545",
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "6px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
    },
  },
  plugins: [],
};

export default config;