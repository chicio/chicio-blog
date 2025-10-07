"use client";

import {
  Cursor,
  SuccessText,
  TerminalLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import {
  ScrollDirection,
  useScrollDirection,
} from "@/components/design-system/utils/hooks/use-scroll-direction";
import { motion } from "framer-motion";
import React from "react";
import { useReadingProgress } from "../utils/hooks/use-reading-progress";
import { useReducedMotions } from "@/components/design-system/utils/hooks/use-reduced-motions";

const getBar = (percentage: number, length = 24) => {
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]  ${percentage}%`;
};

const getStatusLine = (
  status: string,
  shouldReduceMotion: boolean,
) => {
  switch (status) {
    case "uploading":
      return (
        <TerminalLine>
          {"> Uploading knowledge..."} {!shouldReduceMotion ? <Cursor>_</Cursor> : null}
        </TerminalLine>
      );
    case "complete":
      return (
        <TerminalLine>
          <SuccessText>{"> Transfer complete."}</SuccessText>
        </TerminalLine>
      );
    default:
      return null;
  }
};

interface ContentProgressBarProps { 
  contentId: string
}

export const ContentProgressBar: React.FC<ContentProgressBarProps> = ({ contentId }) => {
  const shouldReduceMotion = useReducedMotions();
  const { glassmorphismClass } = useGlassmorphism();
  const { percentage, started, status } = useReadingProgress(contentId);
  const direction = useScrollDirection();
  const isVisible = started && direction === ScrollDirection.down;

  return (
    <motion.div
      key="content-progress-bar"
      className={`${glassmorphismClass} fixed top-0 z-[60] w-full rounded-tl-none rounded-tr-none border-t-0 px-0 py-2`}
      initial={false}
      animate={{
        y: isVisible ? 0 : -100,
        pointerEvents: isVisible ? "auto" : "none",
        transition: { delay: 0.2, duration: 0.4, ease: "linear" },
      }}
      style={{ pointerEvents: isVisible ? "auto" : "none" }}
    >
      <div className="flex w-full flex-col items-center justify-center">
        {getStatusLine(status, shouldReduceMotion)}
        <TerminalLine>
          <SuccessText>{getBar(percentage)}</SuccessText>
        </TerminalLine>
      </div>
    </motion.div>
  );
};
