"use client";

import React, { memo } from "react";
import { useMatrix2dCanvasStore } from "./use-matrix-2d-canvas-store";

interface Matrix2DCanvasProps {
    fontSize: number;
    density: number;
    paused: boolean;
}

const Matrix2DCanvasRenderer: React.FC<Matrix2DCanvasProps> = ({ fontSize, density, paused }) => {
    const { effects } = useMatrix2dCanvasStore(fontSize, density, paused);
    const { setCanvasEl } = effects;

    return (
        <canvas
            className="pointer-events-none absolute top-0 left-0 block h-full w-full"
            ref={setCanvasEl}
        />
    );
};

export const Matrix2DCanvas = memo(Matrix2DCanvasRenderer);
