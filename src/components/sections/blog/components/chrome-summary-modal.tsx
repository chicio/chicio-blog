"use client";

import { Button } from "@/components/design-system/atoms/buttons/button";
import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { Loader } from "@/components/design-system/atoms/loader/loader";
import { TerminalProgressBar } from "@/components/design-system/molecules/terminal-progress-bar/terminal-progress-bar";
import { useReducedMotions } from "@/components/design-system/utils/hooks/use-reduced-motions";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { Variants } from "framer-motion";
import { FC, useEffect } from "react";

const modalVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.85, transition: { duration: 0.2 } },
};

type ModalStatus = "downloading" | "loading" | "streaming" | "done" | "error";

interface ChromeSummaryModalProps {
    title: string;
    content: string;
    status: ModalStatus;
    downloadProgress: number;
    onClose: () => void;
    onRetry: () => void;
}

export const ChromeSummaryModal: FC<ChromeSummaryModalProps> = ({
    title,
    content,
    status,
    downloadProgress,
    onClose,
    onRetry,
}) => {
    const shouldReduceMotion = useReducedMotions();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    return (
        <Overlay onClick={onClose} delay={0.15}>
            <MotionDiv
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="fixed top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl bg-general-background p-8 w-[90%] sm:w-[70%] md:w-[60%] max-h-[80vh] overflow-auto"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
                <h2 className="mb-4 text-xl font-bold text-accent">{title}</h2>

                {status === "downloading" && (
                    <TerminalProgressBar
                        percentage={downloadProgress}
                        loadingMessage="Downloading AI model..."
                        completeMessage="Model ready."
                        shouldReduceMotion={shouldReduceMotion}
                    />
                )}

                {status === "loading" && (
                    <div className="flex flex-col items-center gap-3 py-8">
                        <Loader size="lg" />
                        <p className="text-sm text-primary-text">Generating summary...</p>
                    </div>
                )}

                {(status === "streaming" || status === "done") && (
                    <div
                        aria-live="polite"
                        className="w-full whitespace-pre-wrap text-primary-text leading-relaxed"
                    >
                        {content}
                    </div>
                )}

                {status === "error" && (
                    <div className="flex flex-col items-center gap-3 py-4">
                        <p className="text-confirm">Something went wrong. Please try again.</p>
                        <Button onClick={onRetry}>
                            <p>Retry</p>
                        </Button>
                    </div>
                )}

                <Button
                    className="relative mt-6 text-primary-text"
                    onClick={onClose}
                >
                    <p>Close</p>
                </Button>
            </MotionDiv>
        </Overlay>
    );
};
