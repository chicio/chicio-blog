import { FC, PropsWithChildren } from "react";
import styled from "styled-components";
import { opacity } from "@/components/design-system/utils/animations/opacity-keyframes";
import { paragraphStyle } from "@/components/design-system/atoms/typography/paragraph";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { ChatAvatar } from "./chat-avatar";

const MessageGroup = styled.div<{ $isUser: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${(props) => props.theme.spacing[1]};
  ${(props) => props.$isUser && "flex-direction: row-reverse;"}
  animation: ${opacity} 0.3s ease-out;
`;

const MessageBubbleContainer = styled.div<{ $isUser: boolean }>`
  max-width: 80%;
  padding: 0 ${(props) => props.theme.spacing[2]};
  border-radius: 1rem;
  background: ${(props) =>
    props.$isUser
      ? props.theme.colors.primaryColor
      : props.theme.colors.generalBackgroundLight};
  color: ${(props) =>
    props.$isUser
      ? props.theme.colors.textAbovePrimaryColor
      : props.theme.colors.primaryTextColor
  } !important;
  ${paragraphStyle};
  margin: 0;
  display: flex;
  flex-direction: column-reverse;
  gap: ${(props) => props.theme.spacing[1]};

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
