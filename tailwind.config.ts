import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "ska-logo": "url('/logo_vert.svg')",
      },
      fontSize: {
        "2xs": "0.7rem",
        "3xs": "0.6rem",
        "4xs": "0.5rem",
      },
      lineHeight: {
        "2xs": "0.9rem",
        "3xs": "0.8rem",
      },
      colors: {
        "ska-primary": "#070068",
        "ska-secondary": "#E50869",
      },
      boxShadow: {
        "t-md": "0 -4px 6px -1px rgba(0, 0, 0, 1)",
        "t-lg": "0 -10px 15px -3px rgba(0, 0, 0, 1)",
      },
      dropShadow: {
        "glow-light": [
          "-80px 20px 80px rgba(255, 255, 255, 0.25)",
          "80px 20px 80px rgba(255, 255, 255, 0.25)",
        ],
        "glow-highlight": [
          "-80px 20px 80px rgba(31, 149, 32, 0.25)",
          "80px 20px 80px rgba(31, 149, 32, 0.25)",
        ],
      },
    },
  },
  plugins: [],
};
export default config;
