"use client";

import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import {
    ScrollDirection,
    useScrollDirection,
} from "@/components/design-system/hooks/use-scroll-direction";
import React from "react";
import { useReadingProgress } from "@/components/design-system/hooks/use-reading-progress";
import { useReducedMotions } from "@/components/design-system/hooks/use-reduced-motions";
import { motion } from "framer-motion";
import { TerminalProgressBar } from "../molecules/terminal-progress-bar/terminal-progress-bar";

interface ContentProgressBarProps {
    contentId: string;
}

export const ContentProgressBar: React.FC<ContentProgressBarProps> = ({ contentId }) => {
    const shouldReduceMotion = useReducedMotions();
    const { glassmorphismClass } = useGlassmorphism();
    const { percentage, started, status } = useReadingProgress(contentId);
    const direction = useScrollDirection();
    const isVisible = started && direction === ScrollDirection.down;

    const progressPercentage = status === "complete" ? 100 : percentage;

    return (
        <motion.div
            key="content-progress-bar"
            className={`${glassmorphismClass} container-fixed fixed top-0 right-0 left-0 z-60 rounded-tl-none rounded-tr-none border-t-0 px-0 py-2`}
            initial={false}
            animate={{
                y: isVisible ? 0 : -100,
                pointerEvents: isVisible ? "auto" : "none",
                transition: { delay: 0.1, duration: 0.4, ease: "linear" },
            }}
            style={{ pointerEvents: isVisible ? "auto" : "none" }}
        >
            <TerminalProgressBar
                percentage={progressPercentage}
                loadingMessage="Uploading knowledge..."
                completeMessage="Transfer complete."
                shouldReduceMotion={shouldReduceMotion}
            />
        </motion.div>
    );
};
