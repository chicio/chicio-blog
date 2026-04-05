import { FC } from "react";

const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-[3px]",
    lg: "h-12 w-12 border-4",
};

interface LoaderProps {
    size?: "sm" | "md" | "lg";
    className?: string;
    label?: string;
}

export const Loader: FC<LoaderProps> = ({ size = "md", className, label = "Loading" }) => (
    <div
        role="status"
        aria-label={label}
        className={`${sizeClasses[size]} animate-spin rounded-full border-accent border-t-transparent${className ? ` ${className}` : ""}`}
    />
);
