import { Container } from "@/components/design-system/atoms/containers/container";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { Heading4 } from "@/components/design-system/atoms/typography/heading4";
import { ChatButton } from "@/components/design-system/molecules/buttons/chat-button";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC, useState } from "react";
import styled from "styled-components";
import { ChatSubtitle } from "./chat-subtitle";

export const ChatHeaderContainer = styled(Container)<{ $isVisible: boolean }>`
  ${glassmorphism}
  text-align: center;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[2]};
  margin: ${(props) => props.theme.spacing[4]} 0 ;
  z-index: 50;
  display: ${(props) => (props.$isVisible ? "block" : "none")};
  
  ${mediaQuery.minWidth.sm} {
    margin: ${(props) => props.theme.spacing[6]} 0 ;
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
      <ChatSubtitle>
        Ask me anything about my work, projects, and software development
        expertise
      </ChatSubtitle>
    </ChatHeaderContainer>
  );
};
