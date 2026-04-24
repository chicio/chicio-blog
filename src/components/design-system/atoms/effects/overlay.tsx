'use client'

import { useLockBodyScroll } from "@/components/design-system/utils/hooks/use-lock-body-scroll";
import { MotionDiv } from "../../molecules/animation/motion-div";
import { FC, ReactNode, useLayoutEffect, useRef } from "react";

export interface OverlayProps {
  delay: number;
  onClick?: () => void;
  children?: ReactNode;
  className?: string;
}

export const Overlay: FC<OverlayProps> = ({ onClick, delay = 0, children, className = "" }) => {
  // After the first commit, suppress initial so toggling motion ON while the
  // overlay is already visible doesn't re-apply opacity:0 and blink.
  const overlayShown = useRef(false);
  useLayoutEffect(() => { overlayShown.current = true; }, []);

  useLockBodyScroll();

  return (
    <MotionDiv
      className={`fixed top-0 left-0 w-full h-full bg-black-alpha-75 backdrop-blur-sm z-40 ${className}`}
      onClick={onClick}
      initial={overlayShown.current ? false : { opacity: 0 }}
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
    </MotionDiv>
  );
};
