import type { Config } from "tailwindcss"
import typography from "@tailwindcss/typography"

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        muted: "#667085",
        line: "#E4E7EC",
        paper: "#F7F8FA",
        brand: {
          50: "#EEF8F6",
          100: "#D7F0EA",
          600: "#167C72",
          700: "#12665E",
        },
        signal: {
          50: "#F1F6FF",
          600: "#315EA8",
        },
      },
      boxShadow: {
        soft: "0 12px 32px rgba(23, 32, 51, 0.08)",
      },
    },
  },
  plugins: [typography],
}

export default config
