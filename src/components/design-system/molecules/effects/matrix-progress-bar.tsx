"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import {
  TerminalLine,
  SuccessText,
  Cursor,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useReadingProgress } from "../../utils/hooks/use-reading-progress";
import { useEffect, useState } from "react";
// Hook per rilevare la direzione dello scroll
function useScrollDirection() {
  const [direction, setDirection] = useState<"up" | "down">("down");
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    function onScroll() {
      const current = window.scrollY;
      if (current > lastScroll) {
        setDirection("down");
      } else if (current < lastScroll) {
        setDirection("up");
      }
      setLastScroll(current);
    }
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScroll]);
  return direction;
}
import { glassmorphism } from "../../atoms/effects/glassmorphism";

const ProgressBarWrapper = styled(motion.div)`
  ${glassmorphism};
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  padding: ${(props) => props.theme.spacing[1]} 0;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  border-top: none;
`;

const ProgressBar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const getBar = (percent: number, length = 20) => {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]  ${percent}%`;
};

const getStatusLine = (
  status: "uploading" | "connected" | "complete" = "uploading"
) => {
  switch (status) {
    case "uploading":
      return (
        <TerminalLine>
          {"> Uploading knowledge..."} <Cursor>_</Cursor>
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

export const MatrixProgressBar: React.FC = () => {
  const { percent, started } = useReadingProgress();
  const direction = useScrollDirection();
  let status: "uploading" | "complete" = "uploading";

  if (percent >= 100) {
    status = "complete";
  }

  return (
    <AnimatePresence>
      {started && direction === "down" && (
        <ProgressBarWrapper
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -60, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <ProgressBar>
            {getStatusLine(status)}
            <TerminalLine>
              <SuccessText>{getBar(percent)}</SuccessText>
            </TerminalLine>
          </ProgressBar>
        </ProgressBarWrapper>
      )}
    </AnimatePresence>
  );
};
