'use client'

import styled from "styled-components";
import { motion } from "framer-motion";
import Link from "next/link";
import { mediaQuery } from "../utils-css/media-query";
import { useState } from "react";
import { slugs } from "@/types/slug";
import { Chat } from "@styled-icons/boxicons-regular";
import { pulse } from "@/components/design-system/utils-css/pulse";

const FloatingContainer = styled(motion.div)`
  position: fixed;
  bottom: ${(props) => props.theme.spacing[2]};
  right: ${(props) => props.theme.spacing[2]};
  z-index: 1000;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, 
    ${props => props.theme.dark.accentColor} 0%, 
    ${props => props.theme.dark.primaryColor} 100%
  );
  backdrop-filter: blur(10px);
  border: 2px solid ${props => props.theme.dark.accentColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  animation: ${pulse} 2s infinite;

  &:hover {
    transform: scale(1.1);
    animation-duration: 1s;
  }

  ${mediaQuery.minWidth.md} {
    width: 60px;
    height: 60px;
    bottom: ${(props) => props.theme.spacing[4]};
    right: ${(props) => props.theme.spacing[6]};
  }
`;

const ChatIcon = styled.div`
  width: 24px;
  height: 24px;
  color: ${props => props.theme.dark.textAbovePrimaryColor};
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQuery.minWidth.md} {
    width: 28px;
    height: 28px;
  }
`;

const Tooltip = styled(motion.div)`
  position: absolute;
  right: calc(100% + 16px);
  top: 50%;
  transform: translateY(-50%);
  background: ${props => props.theme.dark.generalBackground}E6;
  color: ${props => props.theme.dark.accentColor};
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  backdrop-filter: blur(10px);
  border: 1px solid ${props => props.theme.dark.accentColor};
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s ease;
  z-index: 1001;
  
  /* Hide on mobile - only show on desktop */
  display: none;
  
  ${mediaQuery.minWidth.md} {
    display: block;
  }

  &::after {
    content: '';
    position: absolute;
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
    border-left: 8px solid ${props => props.theme.dark.accentColor};
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
  }
`;

export const FloatingChatButton = () => {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  const ButtonContent = (
    <FloatingContainer
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 20,
        delay: 1.5
      }}
      onAnimationComplete={() => setIsAnimationComplete(true)}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      onMouseEnter={(e) => {
        // Show tooltip only if animation is complete
        if (!isAnimationComplete) return;

        const tooltipElement = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
        if (tooltipElement) {
          tooltipElement.style.opacity = '1';
        }
      }}
      onMouseLeave={(e) => {
        // Hide tooltip on leave
        const tooltipElement = e.currentTarget.querySelector('[data-tooltip]') as HTMLElement;
        if (tooltipElement) {
          tooltipElement.style.opacity = '0';
        }
      }}
    >
      <ChatIcon>
        <Chat />
      </ChatIcon>

      {isAnimationComplete && (
        <Tooltip data-tooltip="true">
          Chat with Fabrizio 🟢
        </Tooltip>
      )}
    </FloatingContainer>
  );

  return (
    <Link href={slugs.chat} passHref>
      {ButtonContent}
    </Link>
  );
};
