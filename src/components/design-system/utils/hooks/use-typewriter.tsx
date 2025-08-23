'use client'

import { useState, useEffect } from 'react';

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
  speed: number = 50
): TypewriterState => {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<TypewriterLine[]>([]);
  const [isWaitingForDelay, setIsWaitingForDelay] = useState(true);

  const isComplete = lineIndex >= lines.length;
  const currentLine = isComplete ? null : lines[lineIndex];
  const currentText = currentLine ? currentLine.text.substring(0, charIndex) : '';

  useEffect(() => {
    if (isComplete) return;

    const line = lines[lineIndex];

    // Se stiamo aspettando il delay iniziale della riga
    if (isWaitingForDelay) {
      const delayTimer = setTimeout(() => {
        setIsWaitingForDelay(false);
      }, line.delay || 0);

      return () => clearTimeout(delayTimer);
    }

    const isLineComplete = charIndex >= line.text.length;

    if (isLineComplete) {
        setCompletedLines(prev => [...prev, line]);
        setLineIndex(lineIndex + 1);
        setCharIndex(0);
        setIsWaitingForDelay(true);
    } else {
      const timer = setTimeout(() => {
        setCharIndex(charIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [lineIndex, charIndex, lines, speed, isComplete, isWaitingForDelay]);

  return {
    completedLines,
    currentLine,
    currentText,
    isComplete
  };
};
