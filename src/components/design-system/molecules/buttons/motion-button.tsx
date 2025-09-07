"use client";

import { usePathname } from "next/navigation";
import {
    MotionOffIcon,
    MotionOnIcon,
} from "../../atoms/icons/motion-toggle-icon";
import { useMotionSettings } from "../../utils/context/motion-settings-context";

export const MotionButton = () => {
  const { motionEnabled, toggleMotion } = useMotionSettings();
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }
  
  return (
    <div
      aria-label={motionEnabled ? "Disattiva animazioni" : "Attiva animazioni"}
      onClick={toggleMotion}
    >
      {motionEnabled ? <MotionOnIcon /> : <MotionOffIcon />}
    </div>
  );
};
