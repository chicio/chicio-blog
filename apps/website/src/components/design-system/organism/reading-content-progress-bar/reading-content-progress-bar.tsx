"use client";

import React from "react";
import { motion } from "framer-motion";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { useReadingContentProgressBarStore } from "./use-reading-content-progress-bar-store";

interface ContentProgressBarProps {
    contentId: string;
}

export const ContentProgressBar: React.FC<ContentProgressBarProps> = ({ contentId }) => {
    const { glassmorphismClass } = useGlassmorphism();
    const { state } = useReadingContentProgressBarStore(contentId);
    const { progressPercentage, isVisible, shouldReduceMotion } = state;

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
