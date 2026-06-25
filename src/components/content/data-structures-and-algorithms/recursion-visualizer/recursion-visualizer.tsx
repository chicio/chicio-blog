"use client";

import { FC } from "react";
import {
    RedPillButton,
    BluePillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import { useRecursionVisualizerStore } from "./use-recursion-visualizer-store";

export const RecursiveCallStackVisualizer: FC = () => {
    const { state, effects } = useRecursionVisualizerStore();
    const { stack, returnValue } = state;
    const { step, reset } = effects;

    return (
        <div className="glow-container p-4">
            <div className="mb-4">
                <p className="mb-2 font-semibold">Call Stack (top at the bottom)</p>
                <div className="flex flex-col gap-2">
                    {stack.map((frame, i) => (
                        <div key={i} className="rounded-xl bg-primary-dark px-4 py-2 text-white">
                            sum({frame.n})
                        </div>
                    ))}
                </div>
            </div>

            <div className="mb-2">
                <p>Return value: {returnValue !== null ? returnValue : "–"}</p>
            </div>

            <div className="flex gap-2">
                <RedPillButton onClick={step}>
                    <span className="text-primary-text">Step</span>
                </RedPillButton>
                <BluePillButton onClick={reset}>
                    <span className="text-primary-text">Reset</span>
                </BluePillButton>
            </div>
        </div>
    );
};
