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
            className={`glow-container text-shadow-sm p-2 block text-primary-text ${textSize} leading-none${className ? ` ${className}` : ""}`}
        >
            {children}
        </span>
    );
};
