"use client";

import { MatrixRainDrawContext } from "@/types/matrix-rain";
import React, { memo, useEffect, useRef, useState } from "react";
import { useReducedMotions } from "../../utils/hooks/use-reduced-motions";

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
  frameRate: number,
): MatrixRainDrawContext => {
  setCanvasSize(canvas, context);

  return {
    drops: initializeDrops(canvas, fontSize),
    height: canvas.height / window.devicePixelRatio,
    width: canvas.width / window.devicePixelRatio,
    lastFrameTimestamp: performance.now(),
    timeDistanceBetweenFrames: 1000 / frameRate,
    font: `${fontSize}px 'Courier Prime', monospace`,
    animationFrameId: 0,
  };
};

const observe = (
  canvas: HTMLCanvasElement,
  handleVisibilityChange: (isVisible: boolean) => void,
) => {
  const observer = new window.IntersectionObserver(
    ([entry]) => {
      return handleVisibilityChange(
        entry.isIntersecting || entry.intersectionRect.height > 0,
      );
    },
    {
      root: null,
      rootMargin: "-50px 0px -50px 0px",
      threshold: 0,
    },
  );
  observer.observe(canvas);
  return observer;
};

interface MatrixRainProps {
  fontSize: number;
  frameRate?: number;
  density: number;
}

export const MatrixRainRenderer: React.FC<MatrixRainProps> = ({
  fontSize,
  frameRate = 20,
  density,
}) => {
  const shouldReduceMotion = useReducedMotions();
  const [isVisible, setIsVisible] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastWidth = useRef(0);

  useEffect(() => {
    lastWidth.current = window.innerWidth;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas || shouldReduceMotion) {
      return;
    }

    const observer = observe(canvas, setIsVisible);

    return () => {
      observer.disconnect();
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!isVisible) {
      return;
    }

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
      frameRate
    );

    const resize = () => {
       if (window.innerWidth !== lastWidth.current) {
         lastWidth.current = window.innerWidth;
         matrixRainDrawContext = initialize(canvas, context, fontSize, frameRate);
       }
    };

    const draw = () => {
      context.font = matrixRainDrawContext.font;
      context.fillStyle = backgroundColor;
      context.fillRect(
        0,
        0,
        matrixRainDrawContext.width,
        matrixRainDrawContext.height
      );

      for (let i = 0; i < matrixRainDrawContext.drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const color = colors.find(
          ({ threshold }) => Math.random() < threshold
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
        matrixRainDrawContext.animationFrameId = requestAnimationFrame(frame);
        return;
      }

      draw();

      matrixRainDrawContext.lastFrameTimestamp = now;
      matrixRainDrawContext.animationFrameId = requestAnimationFrame(frame);
    };

    const renderingLoop = () => {
      if (shouldReduceMotion) {
        for (let i = 0; i < frameRate; i++) {
          draw();
        }
      } else {
        matrixRainDrawContext.animationFrameId = requestAnimationFrame(frame);
      }
      window.addEventListener("resize", resize);
    };

    renderingLoop();

    return () => {
      if (matrixRainDrawContext.animationFrameId) {
        cancelAnimationFrame(matrixRainDrawContext.animationFrameId);
      }
      window.removeEventListener("resize", resize);
    };
  }, [fontSize, frameRate, density, isVisible, shouldReduceMotion]);

  return (
    <canvas
      className="pointer-events-none absolute top-0 left-0 block h-full w-full"
      ref={canvasRef}
    />
  );
};


export const MatrixRain = memo(MatrixRainRenderer);