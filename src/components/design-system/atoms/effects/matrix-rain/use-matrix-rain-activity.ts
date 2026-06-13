"use client";

import { RefObject, useEffect, useState } from "react";
import { useReducedMotions } from "../../../utils/hooks/use-reduced-motions";

// Single source of "should the rain pause?" truth, shared by both the WebGPU
// renderer and the 2D fallback so they behave identically. Paused when the
// surface is offscreen OR the site's reduced-motion signal is on (the in-app
// motion toggle via useMotionStore, or a low-end device). This is NOT the OS
// `prefers-reduced-motion` media query. IntersectionObserver options mirror the
// old 2D atom's `observe()`.
export function useMatrixRainActivity(
  ref: RefObject<HTMLElement | null>,
): boolean {
  const reducedMotion = useReducedMotions();
  const [onScreen, setOnScreen] = useState(true);

  useEffect(() => {
    const element = ref.current;

    if (!element) {
      return;
    }

    const observer = new window.IntersectionObserver(
      ([entry]) => {
        setOnScreen(entry.isIntersecting || entry.intersectionRect.height > 0);
      },
      { root: null, rootMargin: "-50px 0px -50px 0px", threshold: 0 },
    );
    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return reducedMotion || !onScreen;
}
