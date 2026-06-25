"use client";

import {
    BluePillButton,
    RedPillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import React from "react";
import { useKadaneVisualizerStore } from "./use-kadane-visualizer-store";

interface KadaneVisualizerProps {
    nums: number[];
}

export const KadaneVisualizer: React.FC<KadaneVisualizerProps> = ({ nums }) => {
    const { state, effects } = useKadaneVisualizerStore(nums);
    const { currentIndex, currentMax, globalMax, highlighted, currentSubarray, finished } = state;
    const { stepForward, resetVisualization } = effects;
    const onStep = stepForward(nums);
    const onReset = resetVisualization(nums);

    return (
        <div className="font-sans">
            <div className="flex gap-2 mb-4">
                {nums.map((num, i) => (
                    <div
                        key={i}
                        className={`px-3 py-2 rounded ${
                            highlighted.includes(i) ? "bg-secondary text-white" : "bg-general-background-light text-white"
                        }`}
                    >
                        {num}
                    </div>
                ))}
            </div>
            <p>
                <strong>Current Index:</strong> {currentIndex}
            </p>
            <p>
                <strong>Current Max:</strong> {currentMax}
            </p>
            <p>
                <strong>Global Max:</strong> {globalMax}
            </p>
            <p>
                <strong>Current Subarray:</strong> [{currentSubarray.join(", ")}]
            </p>

            <div className="flex flex-row gap-2 mt-4">
                <RedPillButton onClick={onStep} disabled={finished}>
                    <span className="text-primary-text">Step</span>
                </RedPillButton>
                <BluePillButton onClick={onReset}>
                    <span className="text-primary-text">Reset</span>
                </BluePillButton>
            </div>
        </div>
    );
};
