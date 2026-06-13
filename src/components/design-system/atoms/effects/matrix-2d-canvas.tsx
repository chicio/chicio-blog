"use client";

import { MatrixRainDrawContext } from "@/types/effects/matrix-rain";
import React, { memo, useEffect, useRef } from "react";
import { debounce } from "@/lib/debounce/debounce";

const matrix = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.=*+-<>".split("");
const colors = [
  { threshold: 0.05, color: "#00FF41" },
  { threshold: 0.15, color: "#39FF14" },
  { threshold: 0.4, color: "#00CC33" },
  { threshold: 0.7, color: "#003D10" },
  { threshold: 0.9, color: "#003D10" },
  { threshold: Number.MAX_SAFE_INTEGER, color: "#002200" },
];
const backgroundColor = `#00110010`;

// Fixed cadence (no consumer ever overrode the old `frameRate` prop). Also the
// number of settle frames drawn synchronously to produce a populated static
// frame when paused.
const FRAME_RATE = 20;

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
) => {
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  context?.scale(dpr, dpr);
};

const initializeDrops = (canvas: HTMLCanvasElement, fontSize: number) => {
  const columns = Math.floor(canvas.width / window.devicePixelRatio / fontSize);
  const drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = Math.floor(
      (Math.random() * (canvas.height / window.devicePixelRatio)) / fontSize,
    );
  }
  return drops;
};

const initialize = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  fontSize: number,
): MatrixRainDrawContext => {
  setCanvasSize(canvas, context);

  return {
    drops: initializeDrops(canvas, fontSize),
    height: canvas.height / window.devicePixelRatio,
    width: canvas.width / window.devicePixelRatio,
    lastFrameTimestamp: performance.now(),
    timeDistanceBetweenFrames: 1000 / FRAME_RATE,
    font: `${fontSize}px 'Courier Prime', monospace`,
    animationFrameId: 0,
  };
};

interface Matrix2DCanvasProps {
  fontSize: number;
  density: number;
  paused: boolean;
}

// The original 2D matrix-rain renderer, extracted as the fallback. Visibility
// and reduced-motion are no longer owned here — the orchestrator computes a
// single `paused` signal (via useMatrixRainActivity) and drives both this and
// the WebGPU renderer, so the two pause identically.
const Matrix2DCanvasRenderer: React.FC<Matrix2DCanvasProps> = ({
  fontSize,
  density,
  paused,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastWidth = useRef(0);
  const rafRef = useRef(0);
  // start/stop the rAF loop, set up by the main effect so the pause effect can
  // toggle it without re-initialising the field.
  const startRef = useRef<() => void>(() => {});
  const stopRef = useRef<() => void>(() => {});
  const pausedRef = useRef(paused);

  useEffect(() => {
    lastWidth.current = window.innerWidth;
  }, []);

  // Build the draw context + loop. Re-runs on fontSize/density change (not on
  // paused). A settle burst paints a populated frame immediately; the loop is
  // (re)started here when not paused, and toggled by the pause effect below.
  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    let matrixRainDrawContext: MatrixRainDrawContext = initialize(
      canvas,
      context,
      fontSize,
    );

    const drawFrame = () => {
      context.font = matrixRainDrawContext.font;
      context.fillStyle = backgroundColor;
      context.fillRect(
        0,
        0,
        matrixRainDrawContext.width,
        matrixRainDrawContext.height,
      );

      for (let i = 0; i < matrixRainDrawContext.drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const color = colors.find(
          ({ threshold }) => Math.random() < threshold,
        )!.color;
        context.fillStyle = color;
        const x = i * fontSize;
        const y = matrixRainDrawContext.drops[i] * fontSize;
        context.fillText(text, x, y);
        if (y > matrixRainDrawContext.height && Math.random() > density) {
          matrixRainDrawContext.drops[i] = 0;
        }
        matrixRainDrawContext.drops[i]++;
      }
    };

    const frame = (now: number) => {
      const elapsed = now - matrixRainDrawContext.lastFrameTimestamp;

      if (elapsed < matrixRainDrawContext.timeDistanceBetweenFrames) {
        rafRef.current = requestAnimationFrame(frame);
        return;
      }

      drawFrame();

      matrixRainDrawContext.lastFrameTimestamp = now;
      rafRef.current = requestAnimationFrame(frame);
    };

    const start = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(rafRef.current);
    };
    startRef.current = start;
    stopRef.current = stop;

    const resize = debounce(() => {
      if (window.innerWidth !== lastWidth.current) {
        lastWidth.current = window.innerWidth;
        matrixRainDrawContext = initialize(canvas, context, fontSize);
        for (let i = 0; i < FRAME_RATE; i++) {
          drawFrame();
        }
        if (!pausedRef.current) {
          start();
        }
      }
    }, 300);

    // Settle burst → an immediately-populated frame (also the paused look).
    for (let i = 0; i < FRAME_RATE; i++) {
      drawFrame();
    }

    if (!pausedRef.current) {
      start();
    }

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [fontSize, density]);

  // Freeze (leave the last frame) when paused; resume the loop when not. Also
  // keeps pausedRef in sync (the debounced resize handler reads it) — updated
  // in an effect, not during render.
  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      stopRef.current();
    } else {
      startRef.current();
    }
  }, [paused]);

  return (
    <canvas
      className="pointer-events-none absolute top-0 left-0 block h-full w-full"
      ref={canvasRef}
    />
  );
};

export const Matrix2DCanvas = memo(Matrix2DCanvasRenderer);
