import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cbm: {
          black: "#000F08",
          forest: "#070B08",
          white: "#F5F2ED",
          red: "#FB3640",
          "red-dark": "#C42030",
          border: "#111511",
          "border-active": "#1A2418",
          gray: {
            100: "#E8E4DE",
            200: "#C8C4BE",
            400: "#8A8780",
            600: "#4A4844",
            800: "#1E1E1A",
          },
        },
      },
      fontFamily: {
        display: ["Panchang", "sans-serif"],
        body: ["Satoshi", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
