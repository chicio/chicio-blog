'use client'

import { DefaultTheme, ThemeProvider } from "styled-components";
import { FC, ReactNode } from "react";
import { GlobalStyle } from "./global-style";
import { MotionConfig } from "framer-motion";

interface ThemePageProps {
  theme: DefaultTheme;
  children?: ReactNode;
}

export const ThemePage: FC<ThemePageProps> = ({ children, theme }) => (
  <MotionConfig reducedMotion="user">
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  </MotionConfig>
);
