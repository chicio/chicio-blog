"use client";

import { useEffect, useRef, useState } from "react";
import type { EffectsStore } from "@/types/component-store";

const GLYPHS = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.=*+-<>".split("");
const FONT_SIZE = 14;
const FRAME_RATE = 20;
const HEAD_COLOR = "#39FF14";
const BODY_COLOR = "#00CC33";
const BACKGROUND_COLOR = "#000c00";
const TRAIL_FADE = "rgba(0, 12, 0, 0.14)";

interface SpoonMatrixRainEffects {
    setCanvasEl: (el: HTMLCanvasElement | null) => void;
}

const sizeCanvas = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D, dpr: number) => {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    context.scale(dpr, dpr);
};

export const useSpoonMatrixRainStore = (paused: boolean): EffectsStore<SpoonMatrixRainEffects> => {
    const [canvasEl, setCanvasEl] = useState<HTMLCanvasElement | null>(null);
    const rafRef = useRef(0);
    const pausedRef = useRef(paused);

    useEffect(() => {
        pausedRef.current = paused;
    }, [paused]);

    useEffect(() => {
        const canvas = canvasEl;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext("2d");

        if (!context) {
            return;
        }

        const dpr = window.devicePixelRatio || 1;
        const width = canvas.offsetWidth;
        const height = canvas.offsetHeight;
        sizeCanvas(canvas, context, dpr);

        const columns = Math.max(1, Math.floor(width / FONT_SIZE));
        const drops = Array.from({ length: columns }, () => Math.floor((Math.random() * height) / FONT_SIZE));
        const interval = 1000 / FRAME_RATE;
        let lastFrame = performance.now();

        context.fillStyle = BACKGROUND_COLOR;
        context.fillRect(0, 0, width, height);

        const drawFrame = () => {
            context.fillStyle = TRAIL_FADE;
            context.fillRect(0, 0, width, height);
            context.font = `${FONT_SIZE}px 'Courier Prime', monospace`;

            for (let i = 0; i < drops.length; i++) {
                const glyph = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                const x = i * FONT_SIZE;
                const y = drops[i] * FONT_SIZE;
                context.fillStyle = Math.random() < 0.2 ? HEAD_COLOR : BODY_COLOR;
                context.fillText(glyph, x, y);

                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                drops[i]++;
            }
        };

        const frame = (now: number) => {
            rafRef.current = requestAnimationFrame(frame);

            if (pausedRef.current || now - lastFrame < interval) {
                return;
            }

            lastFrame = now;
            drawFrame();
        };

        for (let i = 0; i < FRAME_RATE; i++) {
            drawFrame();
        }

        rafRef.current = requestAnimationFrame(frame);

        return () => {
            cancelAnimationFrame(rafRef.current);
        };
    }, [canvasEl]);

    return { effects: { setCanvasEl } };
};
