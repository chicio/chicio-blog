"use client";

import { Button, Loader, MotionDiv, Overlay, TerminalProgressBar } from "matrix-design-system";
import { Markdown } from "matrix-design-system/markdown";
import { Variants } from "framer-motion";
import { FC } from "react";
import { useChromeSummaryModalStore } from "./use-chrome-summary-modal-store";

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
    const { state, effects } = useChromeSummaryModalStore();
    const { shouldReduceMotion } = state;
    const { stopPropagation } = effects;

    return (
        <Overlay onClick={onClose} delay={0.15}>
            <MotionDiv
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="glow-border bg-general-background fixed top-1/2 left-1/2 flex max-h-[80vh] w-[90%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-auto rounded-xl p-8 sm:w-[70%] md:w-[60%]"
                onClick={stopPropagation}
            >
                <h2 className="text-accent mb-4 text-xl font-bold">{title}</h2>
                <hr />
                <div className="my-4">
                    {status === "downloading" && (
                        <TerminalProgressBar
                            percentage={downloadProgress}
                            loadingMessage="Downloading AI model..."
                            completeMessage="Model ready."
                            shouldReduceMotion={shouldReduceMotion}
                        />
                    )}

                    {(status === "loading" || (status === "streaming" && content.length === 0)) && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <Loader size="lg" label="Generating summary" />
                        </div>
                    )}

                    {(status === "streaming" || status === "done") && content.length > 0 && (
                        <div aria-live="polite" className="text-primary-text w-full leading-relaxed">
                            <Markdown content={content} id="chrome-ai-summary" />
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
                </div>

                <Button className="text-primary-text relative mt-6" onClick={onClose}>
                    <p>Close</p>
                </Button>
            </MotionDiv>
        </Overlay>
    );
};
