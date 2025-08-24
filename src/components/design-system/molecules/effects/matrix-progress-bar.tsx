"use client";

import React from "react";
import styled from "styled-components";
import {
  TerminalLine,
  SuccessText,
  Cursor,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useReadingProgress } from "../../utils/hooks/use-reading-progress";
import { glassmorphism } from "../../atoms/effects/glassmorphism";

const ProgressBarWrapper = styled.div`
    ${glassmorphism}
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

const getBar = (percent: number, length = 16) => {
  const filled = Math.round((percent / 100) * length);
  const empty = length - filled;
  return `[${"█".repeat(filled)}${"░".repeat(empty)}]  ${percent}%`;
};

const getStatusLine = (
  status: "uploading" | "connected" | "complete" = "uploading",
  percent: number,
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
  let status: "uploading" | "complete" = "uploading";

  if (percent >= 100) {
    status = "complete";
  }

  return (
    <>
      {started && (
        <ProgressBarWrapper>
          <ProgressBar>
            {getStatusLine(status, percent)}
            <TerminalLine>{getBar(percent)}</TerminalLine>
          </ProgressBar>
        </ProgressBarWrapper>
      )}
    </>
  );
};
