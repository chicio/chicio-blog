'use client'

import { useLockBodyScroll } from "@/components/design-system/hooks/use-lock-body-scroll";
import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import styled from "styled-components";

export interface OverlayProps {
  zIndex: number;
  delay: number; 
  onClick: () => void;
  children?: ReactNode;
}

const StyledOverlay = styled(motion.div)<{ $zIndex: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.$zIndex};
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
`;

export const Overlay: FC<OverlayProps> = ({ zIndex, onClick, delay = 0, children }) => {
  useLockBodyScroll();

  return (
    <StyledOverlay 
      // ref={overlayRef}
      $zIndex={zIndex} 
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
    </StyledOverlay>
  );
};
