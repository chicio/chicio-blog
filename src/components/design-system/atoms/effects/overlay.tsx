'use client'

import { useLockBodyScroll } from "@/components/design-system/utils/hooks/use-lock-body-scroll";
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
 * waiting for an exit that never fires — keeping useLockBodyScroll active
 * and the overlay stuck on screen.
 */
export const Overlay: FC<OverlayProps> = ({ onClick, delay = 0, children, className = "" }) => {
    useLockBodyScroll();

    return (
        <motion.div
            className={`fixed top-0 left-0 w-full h-full bg-black-alpha-75 backdrop-blur-sm z-40 ${className}`}
            onClick={onClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
                // Tween (not spring) guarantees a definite end time so AnimatePresence
                // can reliably unmount after exit and useLockBodyScroll cleanup runs.
                // A spring with damping < 1 oscillates indefinitely until framer-motion's
                // resting threshold is met — if that threshold is never crossed (edge cases
                // in opacity compositing), the overlay stays mounted and body scroll stays
                // locked, which breaks backdrop-blur on sibling fixed elements (menu,
                // brand header) because overflow:hidden on <html> corrupts their compositing.
                duration: delay ? delay + 0.2 : 0.2,
                ease: "easeOut",
                delay,
            }}
        >
            {children}
        </motion.div>
    );
};
