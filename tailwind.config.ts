import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1726",
        fog: "#F4F6FB",
        mint: "#40C9A2",
        sky: "#2C7BE5",
        sun: "#FFB454",
        rose: "#F472B6",
        slateblue: "#6D5DF6"
      },
      boxShadow: {
        soft: "0 10px 30px -12px rgba(15, 23, 42, 0.25)",
        glow: "0 0 0 1px rgba(109, 93, 246, 0.15), 0 12px 24px -14px rgba(44, 123, 229, 0.5)"
      }
    }
  },
  plugins: []
};

export default config;
