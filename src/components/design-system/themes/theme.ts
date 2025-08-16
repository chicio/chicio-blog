import { DefaultTheme } from "styled-components";
import { matrixTheme } from "./blog-colors";

const fontSizes = [
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "22px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "48px",
  "56px",
];

const spacing = [
  "4px",
  "8px",
  "12px",
  "16px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "40px",
  "44px",
  "48px",
  "52px",
  "56px",
  "60px",
];

// Single Matrix Theme - No more light/dark variants
export const blogTheme: DefaultTheme = {
  dark: matrixTheme,    // Keep for legacy compatibility
  light: matrixTheme,   // Same as dark now - will be removed
  fontSizes,
  spacing,
  lineHeight: 1.8,
};
