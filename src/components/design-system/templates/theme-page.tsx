'use client'

import { DefaultTheme, ThemeProvider } from "styled-components";
import { FC, ReactNode } from "react";
import {GlobalStyle} from "@/components/design-system/templates/global-style";

interface ThemePageProps {
  theme: DefaultTheme;
  children?: ReactNode;
}

export const ThemePage: FC<ThemePageProps> = ({ children, theme }) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    {children}
  </ThemeProvider>
);
