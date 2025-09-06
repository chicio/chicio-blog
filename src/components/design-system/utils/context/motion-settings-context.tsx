"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { MotionConfig } from "framer-motion";

interface MotionSettingsContextType {
  motionEnabled: boolean;
  toggleMotion: () => void;
}

const MotionSettingsContext = createContext<MotionSettingsContextType>({
  motionEnabled: true,
  toggleMotion: () => {},
});

export const useMotionSettings = () => useContext(MotionSettingsContext);

export const MotionSettingsProvider = ({ children }: { children: ReactNode }) => {
  const [motionEnabled, setMotionEnabled] = useState(true);
  const toggleMotion = () => setMotionEnabled((v) => !v);

  return (
    <MotionSettingsContext.Provider value={{ motionEnabled, toggleMotion }}>
      <MotionConfig reducedMotion={motionEnabled ? "user" : "always"}>
        {children}
      </MotionConfig>
    </MotionSettingsContext.Provider>
  );
};
