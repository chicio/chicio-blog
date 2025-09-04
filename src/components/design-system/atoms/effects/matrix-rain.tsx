"use client";

import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import {
  matrixBackgroundDark,
  matrixBackgroundLight,
  matrixDarkGreen,
  matrixNeoGreen,
  matrixPrimaryGreen,
  matrixTextGreen,
} from "../../themes/colors";
import { MatrixRainDrawContext } from "@/types/matrix-rain";

const MatrixCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: block;
`;

const matrix = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.=*+-<>".split("");
const colors = [
  { threshold: 0.05, color: matrixPrimaryGreen },
  { threshold: 0.15, color: matrixNeoGreen },
  { threshold: 0.4, color: matrixTextGreen },
  { threshold: 0.7, color: matrixDarkGreen },
  { threshold: 0.9, color: matrixDarkGreen },
  { threshold: Number.MAX_SAFE_INTEGER, color: matrixBackgroundLight },
];
const backgroundColor = `${matrixBackgroundDark}10`;

const setCanvasSize = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D
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
      (Math.random() * (canvas.height / window.devicePixelRatio)) / fontSize
    );
  }
  return drops;
};

const initialize = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  fontSize: number,
  frameRate: number
): MatrixRainDrawContext => {
  setCanvasSize(canvas, context);

  return {
    drops: initializeDrops(canvas, fontSize),
    height: canvas.height / window.devicePixelRatio,
    width: canvas.width / window.devicePixelRatio,
    lastFrameTimestamp: performance.now(),
    timeDistanceBetweenFrames: 1000 / frameRate,
    font: `${fontSize}px 'Courier New', monospace`,
    animationFrameId: 0,
  };
};

interface MatrixRainProps {
  fontSize: number;
  frameRate?: number;
  density: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize,
  frameRate = 20,
  density,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
      frameRate
    );

    const start = () => {
      matrixRainDrawContext = initialize(canvas, context, fontSize, frameRate);
    };

    const draw = (now: number) => {
      const elapsed = now - matrixRainDrawContext.lastFrameTimestamp;

      if (elapsed < matrixRainDrawContext.timeDistanceBetweenFrames) {
        matrixRainDrawContext.animationFrameId = requestAnimationFrame(draw);
        return;
      }

      matrixRainDrawContext.lastFrameTimestamp = now;

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
      matrixRainDrawContext.animationFrameId = requestAnimationFrame(draw);
    };

    matrixRainDrawContext.animationFrameId = requestAnimationFrame(draw);
    window.addEventListener("resize", start);

    return () => {
      cancelAnimationFrame(matrixRainDrawContext.animationFrameId);
      window.removeEventListener("resize", start);
    };
  }, [fontSize, frameRate, density]);

  return <MatrixCanvas ref={canvasRef} />;
};
