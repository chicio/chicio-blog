"use client";

import { Variants } from "framer-motion";
import { FC, PropsWithChildren } from "react";
import { MotionDiv } from "@/components/design-system/atoms/animation/motion-div";
import { useGlassmorphismBackgroundStore } from "./use-glassmorphism-background-store";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
    },
};

interface GlassmorphismBackgroundProps {
    className?: string;
}

export const GlassmorphismBackground: FC<PropsWithChildren<GlassmorphismBackgroundProps>> = ({
    className,
    children,
}) => {
    const { state } = useGlassmorphismBackgroundStore();
    const { glassmorphismClass } = state;

    return (
        <MotionDiv
            className={`${glassmorphismClass} relative p-5 md:p-9 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </MotionDiv>
    );
};
