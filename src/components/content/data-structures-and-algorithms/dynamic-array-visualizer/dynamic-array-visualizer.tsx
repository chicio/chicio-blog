"use client";

import { BluePillButton, RedPillButton } from "@/components/design-system/molecules/buttons/pills-buttons";
import { FC } from "react";
import { useDynamicArrayVisualizerStore } from "./use-dynamic-array-visualizer-store";

export const DynamicArrayVisualizer: FC = () => {
    const { state, effects } = useDynamicArrayVisualizerStore();
    const { arr, capacity } = state;
    const { push, reset } = effects;

    return (
        <div>
            <div className="mb-2 flex flex-wrap gap-2">
                {Array.from({ length: capacity }).map((_, i) => (
                    <div
                        key={i}
                        className={`flex h-10 w-10 items-center justify-center rounded-xl ${i < arr.length ? "bg-primary-dark text-white" : "bg-gray-200"}`}
                    >
                        {arr[i]}
                    </div>
                ))}
            </div>
            <div className="flex flex-col items-center">
                <p>
                    Capacity: {capacity}, Size: {arr.length}
                </p>
                <div className="flex flex-row gap-2">
                    <RedPillButton onClick={push}>
                        <span className="text-primary-text">Push</span>
                    </RedPillButton>
                    <BluePillButton onClick={reset}>
                        <span className="text-primary-text">Reset</span>
                    </BluePillButton>
                </div>
            </div>
        </div>
    );
};
