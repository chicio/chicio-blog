"use client";

import styled from "styled-components";
import { glowText } from "../effects/glow";
import { mediaQuery } from "../../utils/media-query";

export const TerminalLine = styled.div`
  ${glowText};
  margin-bottom: ${(props) => props.theme.spacing[1]};
  font-family: "Courier New", monospace;
  font-weight: bold;
  line-height: 1.4;
  color: ${(props) => props.theme.colors.accentColor};
  font-size: 0.8rem;
  word-break: break-word;

  ${mediaQuery.minWidth.sm} {
    font-size: 0.875rem;
  }

  ${mediaQuery.minWidth.md} {
    font-size: 0.95rem;
  }
`;

export const TerminalQuoteLine = styled.div`
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

export const Cursor = styled.span`
  animation: blink 1s infinite;
  @keyframes blink {
    0%,
    50% {
      opacity: 1;
    }
    51%,
    100% {
      opacity: 0;
    }
  }
`;

export const ErrorText = styled.span`
  color: #ff6b6b;
  font-weight: bold;
`;

export const SuccessText = styled.span`
  color: ${(props) => props.theme.colors.accentColor};
  ${glowText}
`;
