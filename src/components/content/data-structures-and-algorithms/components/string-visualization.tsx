"use client";

import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import React, { useState } from "react";

interface CharBoxProps {
  char: string;
  index: number;
  highlight?: boolean;
}

const CharBox: React.FC<CharBoxProps> = ({ char, index, highlight }) => (
  <div
    className={`flex h-10 w-10 items-center justify-center rounded border font-mono text-text-above-primary ${
      highlight ? "bg-primary-dark text-white" : "bg-gray-200"
    }`}
    key={index}
  >
    {char}
  </div>
);

export const StringVisualization: React.FC = () => {
  const inputString = "hello";
  const addedString = " world";
  const [result, setResult] = useState<string[]>(inputString.split(""));

  const handleConcatenate = () => {
    const newStr = [...inputString.split(""), ...addedString.split("")];
    setResult(newStr);
  };

  return (
    <div className="glow-container h-32 w-full p-5 my-5 flex flex-col items-center justify-center">
      <div className="flex flex-wrap gap-2 mb-4">
        {result.map((char, idx) => (
          <CharBox
            key={idx}
            char={char}
            index={idx}
            highlight={idx >= inputString.length}
          />
        ))}
      </div>
      <RedPillButton onClick={handleConcatenate}>
        <span className="text-primary-text">Concatenate</span>
      </RedPillButton>
    </div>
  );
};
