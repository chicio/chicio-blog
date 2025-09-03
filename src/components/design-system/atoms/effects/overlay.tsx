'use client'

import { useLockBodyScroll } from "@/components/design-system/utils/hooks/use-lock-body-scroll";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

export interface OverlayProps {
  delay: number; 
  onClick?: () => void;
  children?: ReactNode;
}

export const Overlay: FC<OverlayProps> = ({ onClick, delay = 0, children }) => {
  useLockBodyScroll();

  return (
    <motion.div
      className="fixed top-0 left-0 w-full h-full bg-black-alpha-60 backdrop-blur-sm z-50"
      onClick={onClick}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.25,
        delay
      }}
    >
      {children}
    </motion.div>
  );
};
