"use client";

import React, { FC, PropsWithChildren } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren & {
  className?: string;
}

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => (
  <button className={`glassmorphism bg-transparent p-3 sm:p-5 text-text-above-primary cursor-pointer text-left flex items-center gap-3${className ? ` ${className}` : ""}`} {...props}>
    {children}
  </button>
);