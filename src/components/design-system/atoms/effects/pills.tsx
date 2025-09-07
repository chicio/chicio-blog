'use client'

import { FC, PropsWithChildren } from "react";
import { useReducedMotions } from "../../utils/hooks/use-reduced-motions";

export const RedPill: FC<PropsWithChildren> = ({ children }) => {
  const shouldReduceMotion = useReducedMotions();

  return (
    <div className={`pill pill-red${shouldReduceMotion ? " pill-red-glass-lite" : " pill-red-glass"}`}>
      <span className="pill-label">{children}</span>
    </div>
  );
};

export const BluePill: FC<PropsWithChildren> = ({ children }) => {
  const shouldReduceMotion = useReducedMotions();

  return (
    <div className={`pill pill-blue${shouldReduceMotion ? " pill-blue-glass-lite" : " pill-blue-glass"}`}>
      <span className="pill-label">{children}</span>
    </div>
  );
};
