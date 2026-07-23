"use client";

import { FC } from "react";
import { useSpoonMatrixRainStore } from "./use-spoon-matrix-rain-store";

interface SpoonMatrixRainProps {
    paused: boolean;
}

export const SpoonMatrixRain: FC<SpoonMatrixRainProps> = ({ paused }) => {
    const { effects } = useSpoonMatrixRainStore(paused);
    const { setCanvasEl } = effects;

    return (
        <canvas
            data-testid="spoon-matrix-rain"
            className="pointer-events-none absolute top-0 left-0 block h-full w-full"
            ref={setCanvasEl}
        />
    );
};
