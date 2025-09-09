"use client";

import React, { FC, PropsWithChildren } from "react";
import { useGlassmorphism } from "../../utils/hooks/use-glassmorphism";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren & {
  className?: string;
}

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
  const { glassmorphismClass } = useGlassmorphism();
  
  return (
    <button className={`${glassmorphismClass} bg-transparent p-3 sm:p-5 text-text-above-primary cursor-pointer text-left flex items-center gap-3${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </button>
  );
};