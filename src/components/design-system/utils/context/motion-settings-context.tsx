"use client";

import { hasMotion, writeMotion } from "@/lib/motion/motion";
import { MotionConfig } from "framer-motion";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";

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

  useEffect(() => {
    setMotionEnabled(hasMotion());
  }, []);

  useEffect(() => {
    writeMotion(motionEnabled ? "on" : "off");
  }, [motionEnabled]);

  const toggleMotion = () => {
    setMotionEnabled((v) => !v);
  };

  return (
    <MotionSettingsContext.Provider value={{ motionEnabled, toggleMotion }}>
      <MotionConfig reducedMotion={motionEnabled ? "never" : "always"}>
        {children}
      </MotionConfig>
    </MotionSettingsContext.Provider>
  );
};
