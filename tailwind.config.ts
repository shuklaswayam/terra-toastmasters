import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        terra: {
          canvas: "var(--terra-bg-canvas)",
          surface: "var(--terra-bg-surface)",
          subtle: "var(--terra-bg-subtle)",
          text: {
            primary: "var(--terra-text-primary)",
            secondary: "var(--terra-text-secondary)",
            tertiary: "var(--terra-text-tertiary)",
          },
          border: {
            hairline: "var(--terra-border-hairline)",
            strong: "var(--terra-border-strong)",
          },
          amber: {
            DEFAULT: "#D97706",
            hover: "#B45309",
            light: "#FEF3C7",
          },
          emerald: {
            DEFAULT: "#059669",
            hover: "#047857",
            light: "#D1FAE5",
          },
          rose: {
            DEFAULT: "#DC2626",
            hover: "#B91C1C",
            light: "#FEE2E2",
          },
          blue: {
            DEFAULT: "#0071E3",
            hover: "#0058B0",
            light: "#EBF5FF",
          },
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Text"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        display: [
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          '"SF Mono"',
          '"JetBrains Mono"',
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
      },
      boxShadow: {
        rest: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)",
        bento: "0 4px 20px -2px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)",
        float: "0 16px 36px -8px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)",
        modal: "0 25px 50px -12px rgba(0, 0, 0, 0.20)",
      },
    },
  },
  plugins: [],
};

export default config;
