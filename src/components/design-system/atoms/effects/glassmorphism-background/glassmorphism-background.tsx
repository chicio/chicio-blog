"use client";

import { motion, stagger, Variants } from "framer-motion";
import { FC, PropsWithChildren } from "react";
import { useGlassmorphismBackgroundStore } from "./use-glassmorphism-background-store";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            delayChildren: stagger(0.3),
        },
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
    const { glassmorphismClass, motionEnabled } = state;

    if (!motionEnabled) {
        return (
            <div className={`${glassmorphismClass} relative p-5 md:p-9 ${className}`}>
                {children}
            </div>
        );
    }

    return (
        <motion.div
            className={`${glassmorphismClass} relative p-5 md:p-9 ${className}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {children}
        </motion.div>
    );
};
