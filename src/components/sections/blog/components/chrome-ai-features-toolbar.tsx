"use client";

import { FC, useCallback, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Accordion } from "@/components/design-system/molecules/accordion/accordion";
import { Button } from "@/components/design-system/atoms/buttons/button";
import { StandardExternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-external-link-with-tracking";
import { tracking } from "@/types/configuration/tracking";
import { trackWith } from "@/lib/tracking/tracking";
import { useChromeSummarize, SummaryType } from "../hooks/use-chrome-summarize";
import { ChromeSummaryModal } from "./chrome-summary-modal";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { SiProbot } from "react-icons/si";

interface ChromeAiFeaturesToolbarProps {
  contentContainerId: string;
}

export const ChromeAiFeaturesToolbar: FC<ChromeAiFeaturesToolbarProps> = ({
  contentContainerId,
}) => {
  const { isAvailable, status, result, downloadProgress, summarize, reset } =
    useChromeSummarize();
  const { glassmorphismClass } = useGlassmorphism();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [activeSummaryType, setActiveSummaryType] =
    useState<SummaryType>("tldr");

  const handleSummarize = useCallback(
    (type: SummaryType) => {
      const container = document.getElementById(contentContainerId);

      if (!container) {
        return;
      }

      const text = container.innerText;
      const title = type === "tldr" ? "TL;DR" : "Key Points";

      trackWith({
        action:
          type === "tldr"
            ? tracking.action.chrome_ai_tldr
            : tracking.action.chrome_ai_key_points,
        category: tracking.category.blog_post,
        label: tracking.label.body,
      });

      setModalTitle(title);
      setActiveSummaryType(type);
      setModalOpen(true);
      summarize(type, text);
    },
    [contentContainerId, summarize],
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
    reset();
  }, [reset]);

  const handleRetry = useCallback(() => {
    const container = document.getElementById(contentContainerId);
    if (!container) {
      return;
    }
    summarize(activeSummaryType, container.innerText);
  }, [contentContainerId, activeSummaryType, summarize]);

  if (!isAvailable) {
    return null;
  } 

  return (
    <>
      <div className={`${glassmorphismClass} p-2`}>
        <Accordion
          title={<h5 className="flex gap-3 items-center"> <SiProbot className="inline text-shadow-md" />AI features</h5>}
          onToggle={() => {
            trackWith({
              action: tracking.action.toggle_chrome_ai_features,
              category: tracking.category.blog_post,
              label: tracking.label.body,
            });
          }}
        >
          <p>
            {"These features require "}
            <StandardExternalLinkWithTracking
              href="https://developer.chrome.com/docs/ai/built-in"
              trackingData={{
                action: tracking.action.open_chrome_ai_docs,
                category: tracking.category.blog_post,
                label: tracking.label.body,
              }}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Chrome 138+
            </StandardExternalLinkWithTracking>
            {" and capable hardware to run."}
          </p>
          <div className="mt-2 flex gap-3 overflow-visible">
            <Button onClick={() => handleSummarize("tldr")}>
              <p>TL;DR</p>
            </Button>
            <Button onClick={() => handleSummarize("key-points")}>
              <p>Key Points</p>
            </Button>
          </div>
        </Accordion>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <ChromeSummaryModal
            title={modalTitle}
            content={result}
            status={status === "idle" ? "loading" : status}
            downloadProgress={downloadProgress}
            onClose={handleClose}
            onRetry={handleRetry}
          />
        )}
      </AnimatePresence>
    </>
  );
};
