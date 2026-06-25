"use client";

import { useState, useEffect, useCallback } from "react";
import { ComponentStore } from "@/types/component-store";

interface BacktrackingVisualizerState {
    path: string[];
    pathsHistory: string[][];
    isRunning: boolean;
}

interface BacktrackingVisualizerEffects {
    start: () => void;
    reset: () => void;
}

const stepDelay = 500;

export const useBacktrackingVisualizerStore = (): ComponentStore<BacktrackingVisualizerState, BacktrackingVisualizerEffects> => {
    const [path, setPath] = useState<string[]>([]);
    const [pathsHistory, setPathsHistory] = useState<string[][]>([]);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        if (!isRunning) {
            return;
        }

        const choices = ["0", "1"];
        const maxDepth = 3;

        function* backtrackGenerator(currentPath: string[]): Generator<string[], void, unknown> {
            if (currentPath.length === maxDepth) {
                setPathsHistory((prev) => [...prev, [...currentPath]]);
                yield [...currentPath];
                return;
            }

            for (const choice of choices) {
                currentPath.push(choice);
                yield [...currentPath];
                yield* backtrackGenerator(currentPath);
                currentPath.pop();
            }
        }

        const gen = backtrackGenerator([]);

        const interval = setInterval(() => {
            const next = gen.next();
            if (next.done) {
                setIsRunning(false);
                clearInterval(interval);
                return;
            }
            setPath(next.value);
        }, stepDelay);

        return () => clearInterval(interval);
    }, [isRunning]);

    const start = useCallback(() => {
        setPath([]);
        setPathsHistory([]);
        setIsRunning(true);
    }, []);

    const reset = useCallback(() => {
        setPath([]);
        setPathsHistory([]);
        setIsRunning(false);
    }, []);

    return {
        state: { path, pathsHistory, isRunning },
        effects: { start, reset },
    };
};
