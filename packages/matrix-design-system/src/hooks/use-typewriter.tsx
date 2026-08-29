'use client'

import { useEffect, useState } from 'react';

interface TypewriterLine {
  text: string;
  type?: 'normal' | 'error' | 'success' | 'quote';
  delay?: number;
}

interface TypewriterState {
  completedLines: TypewriterLine[];
  currentLine: TypewriterLine | null;
  currentText: string;
  isComplete: boolean;
}

export const useTypewriter = (
  lines: TypewriterLine[],
  speed: number = 50,
  shouldStart: boolean = true
): TypewriterState => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isWaitingForDelay, setIsWaitingForDelay] = useState(true);

  const isComplete = lineIndex >= lines.length;
  const currentLine = isComplete ? null : lines[lineIndex];
  const currentText = currentLine ? currentLine.text.substring(0, charIndex) : '';
  const completedLines = lines.slice(0, lineIndex);

  useEffect(() => {
    if (isComplete || !shouldStart) {
      return;
    }

    const line = lines[lineIndex];

    if (isWaitingForDelay) {
      const delayTimer = setTimeout(() => setIsWaitingForDelay(false), line.delay || 0);
      return () => clearTimeout(delayTimer);
    }

    const timer = setTimeout(() => {
      if (charIndex >= line.text.length) {
        setLineIndex(lineIndex + 1);
        setCharIndex(0);
        setIsWaitingForDelay(true);
      } else {
        setCharIndex(charIndex + 1);
      }
    }, speed);
    
    return () => clearTimeout(timer);
  }, [lineIndex, charIndex, lines, speed, isComplete, isWaitingForDelay, shouldStart]);

  return {
    completedLines,
    currentLine,
    currentText,
    isComplete,
  };
};
