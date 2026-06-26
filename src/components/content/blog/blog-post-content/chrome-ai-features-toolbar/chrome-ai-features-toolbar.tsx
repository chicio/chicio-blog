"use client";

import { FC } from "react";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "@/components/design-system/molecules/accordion/accordion";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import { SiProbot } from "react-icons/si";
import { useChromeAiFeaturesToolbarStore } from "./use-chrome-ai-features-toolbar-store";
import { ChromeSummaryModal } from "./chrome-summary-modal";

interface ChromeAiFeaturesToolbarProps {
    contentContainerId: string;
}

export const ChromeAiFeaturesToolbar: FC<ChromeAiFeaturesToolbarProps> = ({
    contentContainerId,
}) => {
    const { state, effects } = useChromeAiFeaturesToolbarStore(contentContainerId);
    const { glassmorphismClass } = useGlassmorphism();
    const { isAvailable, modalOpen, modalTitle, summaryResult, summaryStatus, downloadProgress } = state;
    const { handleClose, handleRetry, handleToggleAccordion } = effects;
    const handleSummarizeTldr = effects.handleSummarize("tldr");
    const handleSummarizeKeyPoints = effects.handleSummarize("key-points");

    if (!isAvailable) {
        return null;
    }

    return (
        <>
            <div className={`${glassmorphismClass} p-2`}>
                <Accordion
                    title={<h5 className="flex gap-3 items-center mt-0"><SiProbot className="inline text-shadow-md" />AI features</h5>}
                    onToggle={handleToggleAccordion}
                >
                    <p>
                        {"These features require "}
                        <StandardExternalLinkWithTracking
                            href="https://developer.chrome.com/docs/ai/built-in"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent underline"
                        >
                            Chrome 138+
                        </StandardExternalLinkWithTracking>
                        {" and capable hardware to run."}
                    </p>
                    <div className="mt-2 flex gap-3 overflow-visible">
                        <Button onClick={handleSummarizeTldr}>
                            <p>TL;DR</p>
                        </Button>
                        <Button onClick={handleSummarizeKeyPoints}>
                            <p>Key Points</p>
                        </Button>
                    </div>
                </Accordion>
            </div>

            <AnimatePresence>
                {modalOpen && (
                    <ChromeSummaryModal
                        title={modalTitle}
                        content={summaryResult}
                        status={summaryStatus}
                        downloadProgress={downloadProgress}
                        onClose={handleClose}
                        onRetry={handleRetry}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
