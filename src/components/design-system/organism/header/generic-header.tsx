import { Container } from "@/components/design-system/atoms/containers/container";
import { glassmorphism } from "@/components/design-system/atoms/effects/glassmorphism";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC, useState } from "react";
import styled from "styled-components";
import { ChatSubtitle } from "../../../sections/chat/components/chat-subtitle";

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
  title: string;
  subtitle: string;
  logo: React.ReactElement; 
  visible?: boolean;
}

export const GenericHeader: FC<ChatHeaderProps> = ({ title, subtitle, logo, visible = true }) => {
  const [isSubtitleExpanded, setIsSubtitleExpanded] = useState(false);

  const toggleSubtitle = () => {
    setIsSubtitleExpanded(!isSubtitleExpanded);
  };

  return (
    <ChatHeaderContainer $isVisible={visible} onClick={toggleSubtitle}>
      <TitleGroup>
        {logo}
        <h4>{title}</h4>
      </TitleGroup>
      <ChatSubtitle>
        {subtitle}
      </ChatSubtitle>
    </ChatHeaderContainer>
  );
};
