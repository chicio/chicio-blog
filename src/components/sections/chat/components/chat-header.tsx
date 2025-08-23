import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import React, { FC, useState } from "react";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { menuHeight } from "@/components/design-system/organism/menu";
import { ChatSubtitle } from "./chat-subtitle";
import { glassmorphism } from "@/components/design-system/atoms/glassmorphism";
import { Container } from "@/components/design-system/atoms/container";
import { Heading3 } from "@/components/design-system/atoms/heading3";
import { Heading4 } from "@/components/design-system/atoms/heading4";
import { ChatButton } from "@/components/design-system/molecules/chat-button";

export const ChatHeaderContainer = styled(Container)<{ $isVisible: boolean }>`
  ${glassmorphism}
  text-align: center;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[2]};
  margin-top: ${(props) => props.theme.spacing[6]};
  z-index: 50;
  display: ${(props) => (props.$isVisible ? "block" : "none")};

  ${mediaQuery.minWidth.sm} {
    padding: ${(props) => props.theme.spacing[4]}
      ${(props) => props.theme.spacing[3]};
  }
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => props.theme.spacing[2]};
  margin-bottom: ${(props) => props.theme.spacing[1]};

  ${mediaQuery.maxWidth.sm} {
    gap: ${(props) => props.theme.spacing[1]};
    margin-bottom: ${(props) => props.theme.spacing[0]};
  }
`;

const ChatIcon = styled.div`
  width: 36px;
  height: 36px;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.primaryColor},
    ${(props) => props.theme.light.accentColor}
  );
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px ${(props) => props.theme.light.primaryColor}40;
  animation: pulse 3s ease-in-out infinite;
  flex-shrink: 0;

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
  }

  ${mediaQuery.dark} {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    box-shadow: 0 4px 15px ${(props) => props.theme.dark.primaryColor}50;
  }

  ${mediaQuery.maxWidth.sm} {
    width: 24px;
    height: 24px;
    font-size: 0.9rem;
  }
`;

const SubtitleContainer = styled.div<{ $isExpanded: boolean }>`
  overflow: hidden;
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;

  ${mediaQuery.maxWidth.sm} {
    max-height: ${(props) => (props.$isExpanded ? "100px" : "0")};
    opacity: ${(props) => (props.$isExpanded ? "1" : "0")};
  }

  ${mediaQuery.minWidth.sm} {
    max-height: none;
    opacity: 1;
  }
`;

export interface ChatHeaderProps {
  hasMessages?: boolean;
}

export const ChatHeader: FC<ChatHeaderProps> = ({ hasMessages = false }) => {
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(false);
  const isVisible = !hasMessages;

  const toggleSubtitle = () => {
    setIsSubtitleExpanded(!isSubtitleExpanded);
  };

  return (
    <ChatHeaderContainer $isVisible={isVisible} onClick={toggleSubtitle}>
      <TitleGroup>
        <ChatButton />
        <Heading4>Chat with Fabrizio</Heading4>
      </TitleGroup>
      <SubtitleContainer $isExpanded={isSubtitleExpanded}>
        <ChatSubtitle>
          Ask me anything about my work, projects, and software development
          expertise
        </ChatSubtitle>
      </SubtitleContainer>
    </ChatHeaderContainer>
  );
};
