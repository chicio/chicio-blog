'use client'

import { FC, ReactNode } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";

interface ThemePageProps {
  theme: DefaultTheme;
  children?: ReactNode;
}

export const ThemePage: FC<ThemePageProps> = ({ children, theme }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);
