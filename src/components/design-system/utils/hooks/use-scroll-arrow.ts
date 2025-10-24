import { trackWith } from "@/lib/tracking/tracking";
import { animate } from "framer-motion";
import { useEffect, useState } from "react";

export interface ScrollAnimationOptions {
  duration?: number;
  ease?: number[];
}

export const animatedScrollTo = (targetY: number) => {
  const startY = window.pageYOffset;

  return animate(startY, targetY, {
    duration: 0.5,
    ease: "linear",
    onUpdate: (latest) => {
      window.scrollTo(0, latest);
    },
  });
};

export const useScrollArrow = (trackingCategory?: string) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleUserScroll = () => {
      setIsVisible(false);
    };

    window.addEventListener("scroll", handleUserScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleUserScroll);
    };
  }, []);

  const handleScrollDown = () => {
    trackWith({
      category: trackingCategory || "",
      label: undefined,
      action: "open_down_arrow",
    });
    animatedScrollTo(window.innerHeight);
    setIsVisible(false);
  };

  return {
    isVisible,
    handleScrollDown,
  };
};
