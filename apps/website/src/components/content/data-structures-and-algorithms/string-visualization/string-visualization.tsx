"use client";

import { FC } from "react";
import { RedPillButton } from "matrix-design-system";
import { useStringVisualizationStore } from "./use-string-visualization-store";

interface CharBoxProps {
    char: string;
    index: number;
    highlight?: boolean;
}

const CharBox: FC<CharBoxProps> = ({ char, index, highlight }) => (
    <div
        className={`text-text-above-primary flex h-10 w-10 items-center justify-center rounded border font-mono ${
            highlight ? "bg-primary-dark text-white" : "bg-gray-200"
        }`}
        key={index}
    >
        {char}
    </div>
);

export const StringVisualization: FC = () => {
    const { state, effects } = useStringVisualizationStore();
    const { result, inputLength } = state;
    const { handleConcatenate } = effects;

    return (
        <div className="glow-container my-5 flex h-32 w-full flex-col items-center justify-center p-5">
            <div className="mb-4 flex flex-wrap gap-2">
                {result.map((char, idx) => (
                    <CharBox key={idx} char={char} index={idx} highlight={idx >= inputLength} />
                ))}
            </div>
            <RedPillButton onClick={handleConcatenate}>
                <span className="text-primary-text">Concatenate</span>
            </RedPillButton>
        </div>
    );
};
