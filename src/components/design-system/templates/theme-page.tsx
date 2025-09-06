'use client'

import { FC, ReactNode } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { MotionConfig } from "framer-motion";

interface ThemePageProps {
  theme: DefaultTheme;
  children?: ReactNode;
}

export const ThemePage: FC<ThemePageProps> = ({ children, theme }) => (
  <MotionConfig reducedMotion="user">
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </MotionConfig>
);
