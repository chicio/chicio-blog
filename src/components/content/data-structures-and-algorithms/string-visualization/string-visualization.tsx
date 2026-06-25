"use client";

import { FC } from "react";
import { RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { useStringVisualizationStore } from "./use-string-visualization-store";

interface CharBoxProps {
    char: string;
    index: number;
    highlight?: boolean;
}

const CharBox: FC<CharBoxProps> = ({ char, index, highlight }) => (
    <div
        className={`flex h-10 w-10 items-center justify-center rounded border font-mono text-text-above-primary ${
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
        <div className="glow-container h-32 w-full p-5 my-5 flex flex-col items-center justify-center">
            <div className="flex flex-wrap gap-2 mb-4">
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
