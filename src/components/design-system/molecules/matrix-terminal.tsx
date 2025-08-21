'use client'

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FC, useEffect, useState } from 'react';
import { Quote } from '@/components/design-system/atoms/quote';
import { mediaQuery } from '../utils/media-query';
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
  height: 300px;
  min-height: 250px;
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
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);

  useEffect(() => {
    if (currentLineIndex >= lines.length) return;

    const currentLine = lines[currentLineIndex];
    const fullText = currentLine.type === 'quote' ? currentLine.text : `> ${currentLine.text}`;

    if (currentCharIndex < fullText.length) {
      const timer = setTimeout(() => {
        setCurrentCharIndex(currentCharIndex + 1);
      }, 50); // Velocità di typing: 50ms per carattere

      return () => clearTimeout(timer);
    } else {
      // Linea completata, passa alla successiva dopo un delay
      const lineCompleteTimer = setTimeout(() => {
        const newDisplayedLines = [...displayedLines];
        newDisplayedLines[currentLineIndex] = fullText;
        setDisplayedLines(newDisplayedLines);
        
        setCurrentLineIndex(currentLineIndex + 1);
        setCurrentCharIndex(0);
      }, currentLine.delay || 800);

      return () => clearTimeout(lineCompleteTimer);
    }
  }, [currentLineIndex, currentCharIndex, lines, displayedLines]);

  const renderLineContent = (text: string, type?: 'normal' | 'error' | 'success' | 'quote') => {
    const content = type === 'quote' ? text : text.substring(2);

    switch (type) {
      case 'error':
        return <ErrorText>{content}</ErrorText>;
      case 'success':
        return <SuccessText>{content}</SuccessText>;
      case 'quote':
        return <QuoteText>{content}</QuoteText>;
      default:
        return content;
    }
  };

  const getCurrentLinePartialText = () => {
    if (currentLineIndex >= lines.length) return '';
    const currentLine = lines[currentLineIndex];
    const fullText = currentLine.type === 'quote' ? currentLine.text : `> ${currentLine.text}`;
    return fullText.substring(0, currentCharIndex);
  };

  return (
    <TerminalContainer
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Linee completate */}
      {displayedLines.map((lineText, index) => {
        if (lines[index].type === 'quote') {
          return (
            <TerminalQuoteLine
              key={index}
            >
              {renderLineContent(lineText, lines[index].type)}
            </TerminalQuoteLine>
          );
        }
        
        return (
          <TerminalLine
            key={index}
          >
            <span>{'> '}</span>
            {renderLineContent(lineText, lines[index].type)}
          </TerminalLine>
        );
      })}
      
      {/* Linea corrente in typing */}
      {currentLineIndex < lines.length && (
        <>
          {lines[currentLineIndex].type === 'quote' ? (
            <TerminalQuoteLine>
              {renderLineContent(getCurrentLinePartialText(), lines[currentLineIndex].type)}
            </TerminalQuoteLine>
          ) : (
            <TerminalLine>
              {getCurrentLinePartialText()}
              <Cursor>_</Cursor>
            </TerminalLine>
          )}
        </>
      )}
    </TerminalContainer>
  );
};
