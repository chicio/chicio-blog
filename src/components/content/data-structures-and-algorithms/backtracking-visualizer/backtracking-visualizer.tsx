"use client";

import { FC } from "react";
import { RedPillButton, BluePillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { useBacktrackingVisualizerStore } from "./use-backtracking-visualizer-store";

export const BacktrackingVisualizer: FC = () => {
    const { state, effects } = useBacktrackingVisualizerStore();
    const { path, pathsHistory, isRunning } = state;
    const { start, reset } = effects;

    return (
        <div>
            <p>
                Current path (exploration in progress):
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
                {path.length > 0 ? path.map((p, i) => (
                    <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-dark text-white font-mono"
                    >
                        {p}
                    </div>
                )) : "-"}
            </div>

            <p>
                Completed solutions:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
                {pathsHistory.length > 0 ? pathsHistory.map((p, i) => (
                    <div
                        key={i}
                        className="flex h-10 w-10 items-center justify-center rounded-lg glow-container"
                    >
                        {p.join("")}
                    </div>
                )) : "-"}
            </div>

            <div className="flex gap-2 justify-center">
                <RedPillButton onClick={start} disabled={isRunning}>Run</RedPillButton>
                <BluePillButton onClick={reset} disabled={isRunning}>Reset</BluePillButton>
            </div>
        </div>
    );
};
