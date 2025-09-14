'use client'

import { FC, ReactNode } from "react";
import { MotionSettingsProvider } from "../utils/context/motion-settings-context";

interface ThemePageProps {
  children?: ReactNode;
}

export const MotionPage: FC<ThemePageProps> = ({ children }) => (
   <MotionSettingsProvider>
      {children}
  </MotionSettingsProvider>
);
