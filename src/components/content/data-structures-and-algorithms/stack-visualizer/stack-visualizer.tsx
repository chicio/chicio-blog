"use client";

import {
    BluePillButton,
    RedPillButton,
} from "@/components/design-system/molecules/buttons/pills-buttons";
import { useStackVisualizerStore } from "./use-stack-visualizer-store";

export function StackVisualizer() {
    const { state, effects } = useStackVisualizerStore();
    const { stack, capacity } = state;
    const { push, pop } = effects;

    return (
        <div>
            <div className="mb-2 flex justify-center">
                <div className="flex h-72 flex-col-reverse gap-2 overflow-y-auto rounded-xl border p-2">
                    {Array.from({ length: capacity }).map((_, i) => (
                        <div
                            key={i}
                            className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                                i < stack.length ? "bg-primary-dark text-white" : "bg-gray-200"
                            }`}
                        >
                            {stack[i]}
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-2 flex flex-col items-center">
                <p>In this example the stack has a max capacity of {capacity}, but in general it can grow dynamically.</p>
                <div className="mt-2 flex flex-row gap-2">
                    <RedPillButton onClick={push}>
                        <span className="text-primary-text">Push</span>
                    </RedPillButton>
                    <BluePillButton onClick={pop}>
                        <span className="text-primary-text">Pop</span>
                    </BluePillButton>
                </div>
            </div>
        </div>
    );
}
