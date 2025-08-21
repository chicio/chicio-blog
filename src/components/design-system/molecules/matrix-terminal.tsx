'use client'

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FC } from 'react';
import { Quote } from '@/components/design-system/atoms/quote';
import { mediaQuery } from '../utils/media-query';
import { useTypewriter } from '../hooks/use-typewriter';
import { hideScrollbar } from '../utils/components/hide-scrollbar';

const TerminalContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.9);
  border: 1px solid ${(props) => props.theme.dark.accentColor};
  border-radius: 8px;
  padding: ${(props) => props.theme.spacing[3]};
  font-family: 'Courier New', monospace;
  color: ${(props) => props.theme.dark.accentColor};
  box-shadow: 
    0 0 20px ${(props) => props.theme.dark.accentColor}40,
    inset 0 0 20px rgba(0, 255, 65, 0.1);
  width: 95%;
  max-width: 600px;
  min-width: 280px;
  height: 150px;
  min-height: 150px;
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

const TerminalLine = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[1]};
  font-family: 'Courier New', monospace;
  line-height: 1.4;
  color: ${(props) => props.theme.dark.accentColor};
  font-size: 0.8rem;
  word-break: break-word;

  ${mediaQuery.minWidth.sm} {
    font-size: 0.875rem;
  }

  ${mediaQuery.minWidth.md} {
    font-size: 0.95rem;
  }
`;

const TerminalQuoteLine = styled.div`
  margin-bottom: ${(props) => props.theme.spacing[1]};
  line-height: 1.4;
  font-size: 0.8rem;
  word-break: break-word;

  ${mediaQuery.minWidth.sm} {
    font-size: 0.875rem;
  }

  ${mediaQuery.minWidth.md} {
    font-size: 0.95rem;
  }
`;

const Cursor = styled.span`
  animation: blink 1s infinite;
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
`;

const ErrorText = styled.span`
  color: #ff6b6b;
  font-weight: bold;
`;

const SuccessText = styled.span`
  color: ${(props) => props.theme.dark.accentColor};
  text-shadow: 0 0 10px ${(props) => props.theme.dark.accentColor}50;
`;

const QuoteText = styled(Quote)`
  color: ${(props) => props.theme.dark.accentColor};
  font-style: italic;
  text-align: center;
  font-family: 'Courier New', monospace;
  margin: ${(props) => props.theme.spacing[4]} 0;
  text-shadow: 0 0 10px ${(props) => props.theme.dark.accentColor}30;
  font-size: 0.85rem;
  line-height: 1.5;
  font-weight: bold;

  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}40,
    0 0 10px ${(props) => props.theme.dark.accentColor}20;

  ${mediaQuery.minWidth.sm} {
    font-size: 0.9rem;
  }

  ${mediaQuery.minWidth.md} {
    font-size: 1rem;
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
