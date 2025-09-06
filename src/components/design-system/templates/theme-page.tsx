'use client'

import { FC, ReactNode } from "react";
import { DefaultTheme, ThemeProvider } from "styled-components";
import { MotionSettingsProvider } from "../utils/context/motion-settings-context";

interface ThemePageProps {
  theme: DefaultTheme;
  children?: ReactNode;
}

export const ThemePage: FC<ThemePageProps> = ({ children, theme }) => (
   <MotionSettingsProvider>
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  </MotionSettingsProvider>
);
