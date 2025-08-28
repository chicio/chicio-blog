'use client'

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { TerminalLine, TerminalQuoteLine, Cursor, ErrorText, SuccessText, QuoteText } from '@/components/design-system/atoms/typography/terminal-blocks';
import { mediaQuery } from '../../utils/media-query';
import { useTypewriter } from '../../utils/hooks/use-typewriter';
import { hideScrollbar } from '../../utils/components/hide-scrollbar';
import { borderRadius } from '../../atoms/effects/border';
import { glassmorphism } from '../../atoms/effects/glassmorphism';

const TerminalContainer = styled(motion.div)`
  ${glassmorphism}
  ${borderRadius};
  padding: ${(props) => props.theme.spacing[3]};
  font-family: 'Courier New', monospace;
  color: ${(props) => props.theme.colors.accentColor};
  width: 95%;
  max-width: 600px;
  min-width: 280px;
  min-height: 150px;
  height: 150px;
  margin: 0 auto;
  position: relative;
  z-index: 12;
  overflow-y: auto;
  overflow-x: hidden;
    
  ${hideScrollbar};

  ${mediaQuery.minWidth.sm} {
    width: 85%;
    height: 200px;
    padding: ${(props) => props.theme.spacing[4]};
  }

  ${mediaQuery.minWidth.md} {
    width: 600px;
    height: 250px;
  }

  ${mediaQuery.minWidth.lg} {
    width: 650px;
    max-width: 650px;
  }
`;


interface TerminalLine {
  text: string;
  type?: 'normal' | 'error' | 'success' | 'quote';
  delay?: number;
}

interface MatrixTerminalProps {
  lines: TerminalLine[];
}

export const MatrixTerminal: FC<MatrixTerminalProps> = ({ lines }) => {
  const { completedLines, currentLine, currentText } = useTypewriter(lines);

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
    <TerminalContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {completedLines.map((line, index) => renderLine(line, line.text, false, index))}
      {currentLine && renderLine(currentLine, currentText, true, completedLines.length)}
    </TerminalContainer>
  );
};
