import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import React, { FC, useState } from "react";
import { Heading1 } from "@/components/design-system/atoms/heading1";
import { ChatSubtitle } from "@/components/chat/components/chat-subtitle";
import { menuHeight } from "@/components/design-system/organism/menu";

export const ChatHeaderContainer = styled.div<{ $isVisible: boolean }>`
  text-align: center;
  padding: ${(props) => props.theme.spacing[4]}
    ${(props) => props.theme.spacing[3]};
  position: fixed;
  top: ${menuHeight};
  left: 0;
  right: 0;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  z-index: 50;
  background: rgba(251, 251, 251, 0.8);
  backdrop-filter: blur(30px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: opacity 0.4s ease, visibility 0.4s ease;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  visibility: ${(props) => (props.$isVisible ? "visible" : "hidden")};

  &:hover {
    background: rgba(251, 251, 251, 0.9);
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 60%;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      ${(props) => props.theme.light.primaryColor}30,
      transparent
    );
  }

  ${mediaQuery.dark} {
    background: rgba(33, 34, 33, 0.8);
    backdrop-filter: blur(30px);
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.4);

    &:hover {
      background: rgba(33, 34, 33, 0.9);
    }

    &::after {
      background: linear-gradient(
        90deg,
        transparent,
        ${(props) => props.theme.dark.primaryColor}40,
        transparent
      );
    }
  }

  ${mediaQuery.maxWidth.sm} {
    padding: ${(props) => props.theme.spacing[2]}
      ${(props) => props.theme.spacing[2]};
  }

  ${mediaQuery.minWidth.sm} {
    cursor: default;

    &:hover {
      background: rgba(251, 251, 251, 0.8);
    }

    ${mediaQuery.dark} {
      &:hover {
        background: rgba(33, 34, 33, 0.8);
      }
    }
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

const ChatTitle = styled(Heading1)`
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.light.primaryColor},
    ${(props) => props.theme.light.accentColor}
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  position: relative;
  font-size: ${(props) => props.theme.fontSizes[9]};

  @supports not (-webkit-background-clip: text) {
    color: ${(props) => props.theme.light.primaryColor};
  }

  text-shadow: 0 0 20px ${(props) => props.theme.light.primaryColor}30;

  ${mediaQuery.dark} {
    background: linear-gradient(
      135deg,
      ${(props) => props.theme.dark.primaryColor},
      ${(props) => props.theme.dark.accentColor}
    );
    -webkit-background-clip: text;
    background-clip: text;
    text-shadow: 0 0 20px ${(props) => props.theme.dark.primaryColor}40;

    @supports not (-webkit-background-clip: text) {
      color: ${(props) => props.theme.dark.primaryColor};
    }
  }

  ${mediaQuery.maxWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[6]};
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
  transition: max-height 0.3s ease, opacity 0.3s ease;

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
        <ChatIcon>💬</ChatIcon>
        <ChatTitle>Chat with Fabrizio</ChatTitle>
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
