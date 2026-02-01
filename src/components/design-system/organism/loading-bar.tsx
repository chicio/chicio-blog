"use client";

import {
  Cursor,
  TerminalLine,
} from "@/components/design-system/atoms/typography/terminal-blocks";
import { useEffect, useState } from "react";

const getAnimatedBar = (position: number, length = 24) => {
  const bar = Array(length).fill("░");
  const blockSize = 3;
  for (let i = 0; i < blockSize; i++) {
    const index = (position + i) % length;
    bar[index] = "█";
  }
  return `[${bar.join("")}]`;
};

interface LoadingBarProps {
  message?: string;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  message = "Processing...",
}) => {
  const [position, setPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 24);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <TerminalLine>
        {`> ${message}`} <Cursor/>
      </TerminalLine>
      <TerminalLine>
        {getAnimatedBar(position)}
      </TerminalLine>
    </div>
  );
};
