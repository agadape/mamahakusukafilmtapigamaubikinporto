import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "var(--bg-base)",
        elevated: "var(--bg-elevated)",
        "accent-orange": "var(--accent-orange)",
        "accent-green": "var(--accent-green)",
        "accent-blue": "var(--accent-blue)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
      },
      borderRadius: {
        poster: "10px",
      },
      aspectRatio: {
        poster: "2 / 3",
      },
    },
  },
  plugins: [],
};

export default config;
