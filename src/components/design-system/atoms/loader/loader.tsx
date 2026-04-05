"use client";

import { FC } from "react";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";

const sizeClasses = {
    sm: "h-1.5 w-1.5",
    md: "h-2.5 w-2.5",
    lg: "h-3.5 w-3.5",
};

const gapClasses = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
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
        className={`flex items-center ${gapClasses[size]}${className ? ` ${className}` : ""}`}
    >
        {[0, 1, 2].map((i) => (
            <MotionDiv
                key={i}
                animate={{ y: [0, -8, 0] }}
                transition={{
                    duration: 0.6,
                    repeat: Infinity,
                    delay: i * 0.15,
                    ease: "easeInOut",
                }}
                className={`${sizeClasses[size]} rounded-full bg-accent`}
            />
        ))}
    </div>
);
