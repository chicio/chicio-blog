'use client'

import { Cursor, ErrorText, QuoteText, SuccessText, TerminalLine, TerminalQuoteLine } from '@/components/design-system/atoms/typography/terminal-blocks';
import { FC, useEffect } from 'react';
import { useTypewriter } from '../../utils/hooks/use-typewriter';
import { useGlassmorphism } from '../../utils/hooks/use-glassmorphism';
import { MotionDiv } from '../animation/motion-div';

interface TerminalLine {
  text: string;
  type?: 'normal' | 'error' | 'success' | 'quote';
  delay?: number;
}

interface MatrixTerminalProps {
  lines: TerminalLine[];
  onComplete?: () => void;
}

export const MatrixTerminal: FC<MatrixTerminalProps> = ({ lines, onComplete }) => {
  const { completedLines, currentLine, currentText } = useTypewriter(lines);
  const { glassmorphismClass } = useGlassmorphism();

  useEffect(() => {
    if (completedLines.length === lines.length && !currentLine && onComplete) {
      onComplete();
    }
  }, [completedLines.length, currentLine, lines.length, onComplete]);

  const renderLineContent = (text: string, type?: 'normal' | 'error' | 'success' | 'quote') => {
    switch (type) {
      case 'error':
        return <ErrorText>{text}</ErrorText>;
      case 'success':
        return <SuccessText>{text}</SuccessText>;
      case 'quote':
        return <QuoteText>{text}</QuoteText>;
      default:
        return text;
    }
  };

  const renderLine = (line: TerminalLine, text: string, showCursor: boolean = false, index: number) => {
    if (line.type === 'quote') {
      return (
        <TerminalQuoteLine key={`line-${index}`}>
          {renderLineContent(text, line.type)}
        </TerminalQuoteLine>
      );
    }

    return (
      <TerminalLine key={`line-${index}`}>
        <span>{'> '}</span>
        {renderLineContent(text, line.type)}
        {showCursor && <Cursor>_</Cursor>}
      </TerminalLine>
    );
  };

  return (
    <MotionDiv
      className={`${glassmorphismClass} w-[95%] sm:w-[600px] p-4 min-h-[150px] sm:min-h-[200px]`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {completedLines.map((line, index) => renderLine(line, line.text, false, index))}
      {currentLine && renderLine(currentLine, currentText, true, completedLines.length)}
    </MotionDiv>
  );
};
