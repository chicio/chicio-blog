import { FC, ReactNode } from "react";

export interface ChipProps {
    children: ReactNode;
    big?: boolean;
    className?: string;
}

export const Chip: FC<ChipProps> = ({ children, big = false, className }) => {
    const textSize = big ? "text-2xl" : "text-sm";

    return (
        <span
            className={`glow-container text-primary-text block p-2 text-shadow-sm ${textSize} leading-none${className ? ` ${className}` : ""}`}
        >
            {children}
        </span>
    );
};
