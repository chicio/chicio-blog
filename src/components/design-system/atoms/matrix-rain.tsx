'use client'

import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const MatrixCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  display: block; /* Fix potential display issues */
`;

interface MatrixRainProps {
  fontSize?: number;
  speed?: number;
  density?: number;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({
  fontSize = 16,
  speed = 50,
  density = 0.95
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to full container
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set actual size in memory (scaled for high DPI)
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      // Scale the drawing context back down
      ctx.scale(dpr, dpr);

      // Set display size (CSS)
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Original Matrix katakana characters + some symbols
    const matrixChars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.=*+-<>';
    const matrix = matrixChars.split('');

    // Calculate columns based on actual canvas width
    const getColumns = () => Math.floor((canvas.width / window.devicePixelRatio) / fontSize);
    let columns = getColumns();
    let drops: number[] = [];

    // Initialize drops
    const initializeDrops = () => {
      columns = getColumns();
      drops = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = Math.floor(Math.random() * (canvas.height / window.devicePixelRatio) / fontSize);
      }
    };

    initializeDrops();

    // Matrix colors from our theme
    const matrixColors = {
      bright: '#00FF41',       // matrixPrimaryGreen - brightest
      medium: '#39FF14',       // matrixNeoGreen - medium bright
      normal: '#00CC33',       // matrixTextGreen - normal
      dim: '#006600',          // dimmer green
      verydim: '#003300'       // very dim green
    };

    const draw = () => {
      // Create trailing fade effect
      ctx.fillStyle = 'rgba(0, 17, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      // Draw characters
      for (let i = 0; i < drops.length; i++) {
        // Random character
        const text = matrix[Math.floor(Math.random() * matrix.length)];

        // Color variation for depth effect (more Matrix-like)
        const rand = Math.random();
        if (rand < 0.05) {
          ctx.fillStyle = matrixColors.bright;   // Very rare bright white-green
        } else if (rand < 0.15) {
          ctx.fillStyle = matrixColors.medium;   // Rare bright green
        } else if (rand < 0.4) {
          ctx.fillStyle = matrixColors.normal;   // Common medium green
        } else if (rand < 0.7) {
          ctx.fillStyle = matrixColors.dim;      // Common dim green
        } else {
          ctx.fillStyle = matrixColors.verydim;  // Very dim green
        }

        // Draw character
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.fillText(text, x, y);

        // Reset drop when it reaches bottom or randomly
        if (y > (canvas.height / window.devicePixelRatio) && Math.random() > density) {
          drops[i] = 0;
        }

        // Move drop down
        drops[i]++;
      }
    };

    // Animation loop
    const interval = setInterval(draw, speed);

    // Handle resize
    const handleResize = () => {
      setCanvasSize();
      initializeDrops();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', setCanvasSize);
      window.removeEventListener('resize', handleResize);
    };
  }, [fontSize, speed, density]);

  return <MatrixCanvas ref={canvasRef} />;
};
