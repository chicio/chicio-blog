import React, { FC, PropsWithChildren } from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
    PropsWithChildren & {
        className?: string;
    };

export const Button: FC<ButtonProps> = ({ className, children, ...props }) => {
    return (
        <button
            className={`glow-container text-primary-text flex cursor-pointer items-center bg-transparent p-3 text-left gap-3${className ? ` ${className}` : ""}`}
            {...props}
        >
            {children}
        </button>
    );
};
