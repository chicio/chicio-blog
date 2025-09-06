"use client";

import {
    MotionOffIcon,
    MotionOnIcon,
} from "../../atoms/icons/motion-toggle-icon";
import { useMotionSettings } from "../../utils/context/motion-settings-context";

export const MotionButton = () => {
  const { motionEnabled, toggleMotion } = useMotionSettings();

  return (
    <div
      aria-label={motionEnabled ? "Disattiva animazioni" : "Attiva animazioni"}
      onClick={toggleMotion}
    >
      {motionEnabled ? <MotionOnIcon /> : <MotionOffIcon />}
    </div>
  );
};
