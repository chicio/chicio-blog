'use client'

import { motion } from "framer-motion";
import { FC, ReactNode } from "react";

export interface OverlayProps {
    delay: number;
    onClick?: () => void;
    children?: ReactNode;
    className?: string;
}

/**
 * Overlay backdrop for modals and command palette.
 * Uses motion.div directly (not MotionDiv) so AnimatePresence can always
 * track the exit animation to completion, regardless of the global motion
 * setting. This is critical: MotionDiv conditionally returns a plain <div>
 * when animations are disabled, which causes AnimatePresence to stall forever
 * waiting for an exit that never fires.
 */
export const Overlay: FC<OverlayProps> = ({ onClick, delay = 0, children, className = "" }) => {
    return (
        <motion.div
            className={`fixed top-0 left-0 w-full h-full bg-black-alpha-75 backdrop-blur-sm z-40 ${className}`}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                // Tween guarantees a definite end time so AnimatePresence
                // can reliably unmount after exit.
                duration: delay ? delay + 0.2 : 0.2,
                ease: "easeOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};
