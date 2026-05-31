import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#0f3d2e",
        grass: "#1f7a4d",
        gold: "#d6a83a",
        cream: "#f7f4ea"
      },
      boxShadow: {
        card: "0 16px 40px rgba(15, 61, 46, 0.12)"
      }
    }
  },
  plugins: []
};

export default config;
