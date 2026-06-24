"use client";

import { useEffect, useState } from "react";
import { StateStore } from "@/types/component-store";

const getAnimatedBar = (position: number, length = 24) => {
    const bar = Array(length).fill("░");
    const blockSize = 3;
    for (let i = 0; i < blockSize; i++) {
        const index = (position + i) % length;
        bar[index] = "█";
    }
    return `[${bar.join("")}]`;
};

interface LoadingBarState {
    animatedBar: string;
}

export const useLoadingBarStore = (): StateStore<LoadingBarState> => {
    const [position, setPosition] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setPosition((prev) => (prev + 1) % 24);
        }, 100);

        return () => clearInterval(interval);
    }, []);

    return {
        state: { animatedBar: getAnimatedBar(position) },
    };
};
