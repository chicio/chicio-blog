"use client";

import { motion } from "framer-motion";
import { FC, ReactNode } from "react";
import { useOverlayStore } from "./use-overlay-store";

export interface OverlayProps {
    delay: number;
    onClick?: () => void;
    children?: ReactNode;
    className?: string;
}

export const Overlay: FC<OverlayProps> = ({ onClick, delay = 0, children, className = "" }) => {
    useOverlayStore();

    return (
        <motion.div
            className={`fixed top-0 left-0 w-full h-full bg-black-alpha-75 backdrop-blur-sm z-40 ${className}`}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                type: "spring",
                stiffness: 400,
                damping: 30,
                duration: 0.25,
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};
