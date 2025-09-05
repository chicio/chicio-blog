'use client'

import { Cursor, ErrorText, SuccessText, TerminalLine, TerminalQuoteLine } from '@/components/design-system/atoms/typography/terminal-blocks';
import { motion } from 'framer-motion';
import { FC, useEffect } from 'react';
import { useTypewriter } from '../../utils/hooks/use-typewriter';

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
        return <p className='font-bold text-center text-accent italic m-6 font-mono'>{text}</p>;
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
    <motion.div
      className='glassmorphism w-[95%] sm:w-[600px] p-4 min-h-[150px] sm:min-h-[250px]'
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {completedLines.map((line, index) => renderLine(line, line.text, false, index))}
      {currentLine && renderLine(currentLine, currentText, true, completedLines.length)}
    </motion.div>
  );
};
