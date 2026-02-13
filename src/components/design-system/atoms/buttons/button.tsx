import React, { FC, PropsWithChildren } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & PropsWithChildren & {
  className?: string;
}

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => {  
  return (
    <button className={`glow-container bg-transparent p-3 text-primary-text cursor-pointer text-left flex items-center gap-3${className ? ` ${className}` : ""}`} {...props}>
      {children}
    </button>
  );
};