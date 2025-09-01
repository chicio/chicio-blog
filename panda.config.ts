import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./src/components/**/*.{ts,tsx,js,jsx}", "./src/app/**/*.{ts,tsx,js,jsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      breakpoints: {
        xs: "576px",
        sm: "768px",
        md: "992px",
        lg: "1200px",
      },
      tokens: {
        colors: {
          primary: { value: "#00FF41" },
          secondary: { value: "#00CC33" },
          primaryDark: { value: "#003D10" },
          primaryLight: { value: "#39FF14" },
          background: { value: "#001100" },
          backgroundLight: { value: "#002200" },
          textAbovePrimary: { value: "#000000" },
          textPrimary: { value: "#E8FFE8" },
          textSecondary: { value: "#00CC33" },
          accent: { value: "#39FF14" },
          boxShadowLight: { value: "rgba(0, 255, 65, 0.3)" },
          divider: { value: "#00CC33" },
          confirm: { value: "#ff2a2a" },
          undo: { value: "#33aaff" },
        },
        fontSizes: {
          xs: { value: "12px" },
          sm: { value: "14px" },
          md: { value: "16px" },
          lg: { value: "18px" },
          xl: { value: "20px" },
          "2xl": { value: "22px" },
          "3xl": { value: "24px" },
          "4xl": { value: "28px" },
          "5xl": { value: "32px" },
          "6xl": { value: "36px" },
          "7xl": { value: "40px" },
          "8xl": { value: "48px" },
          "9xl": { value: "56px" },
        },
        spacing: {
          1: { value: "4px" },
          2: { value: "8px" },
          3: { value: "12px" },
          4: { value: "16px" },
          5: { value: "20px" },
          6: { value: "24px" },
          7: { value: "28px" },
          8: { value: "32px" },
          9: { value: "36px" },
          10: { value: "40px" },
          11: { value: "44px" },
          12: { value: "48px" },
          13: { value: "52px" },
          14: { value: "56px" },
          15: { value: "60px" },
        },
        lineHeights: {
          normal: { value: "1.8" },
        },
      },
    },
  },

  // jsx framework
  jsxFramework: "react",

  // The output directory for your css system
  outdir: "styled-system",
});
