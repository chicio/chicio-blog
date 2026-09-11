"use client";

import { FC } from "react";
import { BluePillButton, RedPillButton } from "matrix-design-system";
import { useBacktrackingVisualizerStore } from "./use-backtracking-visualizer-store";

export const BacktrackingVisualizer: FC = () => {
    const { state, effects } = useBacktrackingVisualizerStore();
    const { path, pathsHistory, isRunning } = state;
    const { start, reset } = effects;

    return (
        <div>
            <p>Current path (exploration in progress):</p>
            <div className="mb-4 flex flex-wrap gap-2">
                {path.length > 0
                    ? path.map((p, i) => (
                          <div
                              key={i}
                              className="bg-primary-dark flex h-10 w-10 items-center justify-center rounded-lg font-mono text-white"
                          >
                              {p}
                          </div>
                      ))
                    : "-"}
            </div>

            <p>Completed solutions:</p>
            <div className="mb-6 flex flex-wrap gap-2">
                {pathsHistory.length > 0
                    ? pathsHistory.map((p, i) => (
                          <div key={i} className="glow-container flex h-10 w-10 items-center justify-center rounded-lg">
                              {p.join("")}
                          </div>
                      ))
                    : "-"}
            </div>

            <div className="flex justify-center gap-2">
                <RedPillButton onClick={start} disabled={isRunning}>
                    Run
                </RedPillButton>
                <BluePillButton onClick={reset} disabled={isRunning}>
                    Reset
                </BluePillButton>
            </div>
        </div>
    );
};
