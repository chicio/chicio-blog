import { ChatAvatar } from "@/components/chat/components/chat-avatar";
import { FC, PropsWithChildren } from "react";
import styled from "styled-components";
import { opacity } from "@/components/design-system/utils/animations/opacity-keyframes";
import { paragraphStyle } from "@/components/design-system/atoms/paragraph";
import { mediaQuery } from "@/components/design-system/utils/media-query";

const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing[1]};
  ${(props) => props.$isUser && "flex-direction: row-reverse;"}
  animation: ${opacity} 0.3s ease-out;
`;

const MessageBubbleContainer = styled.div<{ $isUser: boolean }>`
  max-width: 100%;
  padding: 0 ${(props) => props.theme.spacing[2]};
  border-radius: 1rem;
  background: ${(props) =>
    props.$isUser
      ? props.theme.light.primaryColor
      : props.theme.light.generalBackgroundLight};
  color: ${(props) =>
    props.$isUser
      ? props.theme.light.textAbovePrimaryColor
      : props.theme.light.primaryTextColor
  } !important;
  ${paragraphStyle};
  margin: 0;

  ${mediaQuery.dark} {
    background: ${(props) =>
      props.$isUser
        ? props.theme.dark.primaryColor
        : props.theme.dark.generalBackgroundLight};
    color: ${(props) =>
      props.$isUser
        ? props.theme.dark.textAbovePrimaryColor
        : props.theme.dark.primaryTextColor
    } !important;
  }

  ${mediaQuery.minWidth.sm} {
    max-width: 70%;
  }
`;

export const ChatMessage: FC<
  PropsWithChildren<{
    isUser: boolean;
  }>
> = ({ isUser, children }) => (
  <MessageGroup $isUser={isUser}>
    <ChatAvatar isUser={isUser} />
    <MessageBubbleContainer $isUser={isUser}>{children}</MessageBubbleContainer>
  </MessageGroup>
);
