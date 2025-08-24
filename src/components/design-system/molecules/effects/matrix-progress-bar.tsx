"use client";

import React from "react";
import styled from "styled-components";
import {
  TerminalLine,
  SuccessText,
  Cursor,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useReadingProgress } from "../../utils/hooks/use-reading-progress";

const ProgressBarWrapper = styled.div`
  position: fixed;
  top: 0;
  z-index: 100;
  width: 100%;
  background: rgba(10, 20, 10, 0.85);
  box-shadow: 0 2px 8px #00ff41;
  padding: 0.5rem 0;
`;

const ProgressBar = styled.div`
  margin-top: ${(props) => props.theme.spacing[1]};
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const getBar = (percent: number, length = 10) => {
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
          {"> Uploading knowledge..."} <Cursor>_</Cursor> {getBar(percent)}
        </TerminalLine>
      );
    case "complete":
      return (
        <TerminalLine>
          <SuccessText>{"> Transfer complete."}</SuccessText> {getBar(percent)}
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
            {/* <TerminalLine>{getBar(percent)}</TerminalLine> */}
          </ProgressBar>
        </ProgressBarWrapper>
      )}
    </>
  );
};
