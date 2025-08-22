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
} from "../themes/blog-colors";

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

interface MatrixRainProps {
  fontSize?: number;
  speed?: number;
  density?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize,
  speed,
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

    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      context.scale(dpr, dpr);
    };

    const initializeDrops = () => {
      const columns = Math.floor(
        canvas.width / window.devicePixelRatio / fontSize
      );
      const drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(
          (Math.random() * (canvas.height / window.devicePixelRatio)) / fontSize
        );
      }
      return drops;
    };

    const matrix = "ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.=*+-<>".split(
      ""
    );
    const colors = [
      { threshold: 0.05, color: matrixPrimaryGreen },
      { threshold: 0.15, color: matrixNeoGreen },
      { threshold: 0.4, color: matrixTextGreen },
      { threshold: 0.7, color: matrixDarkGreen },
      { threshold: 0.9, color: matrixDarkGreen },
      { threshold: Number.MAX_SAFE_INTEGER, color: matrixBackgroundLight },
    ];
    const font = `${fontSize}px 'Courier New', monospace`;
    const backgroundColor = `${matrixBackgroundDark}10`
    let drops: number[] = initializeDrops();

    const initialize = () => {
      setCanvasSize();
      drops = initializeDrops();
    };

    initialize();

    let lastFrame = performance.now();
    let animationFrameId: number;

    const draw = (now: number) => {
      const elapsed = now - lastFrame;

      if (elapsed < speed) {
        animationFrameId = requestAnimationFrame(draw);
        return;
      }
      lastFrame = now;
      const height = canvas.height / window.devicePixelRatio;
      const width = canvas.width / window.devicePixelRatio;

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, width, height);
      context.font = font;

      for (let i = 0; i < drops.length; i++) {
        const text = matrix[Math.floor(Math.random() * matrix.length)];
        const color = colors.find(({ threshold }) => Math.random() < threshold)!.color;
        context.fillStyle = color;
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        context.fillText(text, x, y);

        if (y > height && Math.random() > density) {
          drops[i] = 0;
        }

        drops[i]++;
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);
    window.addEventListener("resize", initialize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", initialize);
    };
  }, [fontSize, speed, density]);

  return <MatrixCanvas ref={canvasRef} />;
};
