import { User } from "@styled-icons/boxicons-regular";
import Image from "next/image";
import styled from "styled-components";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { FC } from "react";

const Avatar = styled.div<{ $isUser: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  flex-shrink: 0;
  background: ${(props) =>
    props.$isUser
      ? props.theme.light.primaryColor
      : props.theme.light.generalBackgroundLight};
  color: ${(props) =>
    props.$isUser
      ? props.theme.light.textAbovePrimaryColor
      : props.theme.light.primaryTextColor};
  overflow: hidden;

  ${mediaQuery.dark} {
    background: ${(props) =>
      props.$isUser
        ? props.theme.dark.primaryColor
        : props.theme.dark.generalBackgroundLight};
    color: ${(props) =>
      props.$isUser
        ? props.theme.dark.textAbovePrimaryColor
        : props.theme.dark.primaryTextColor};
  }

  ${mediaQuery.minWidth.sm} {
    width: 40px;
    height: 40px;
    font-size: 1.2rem;
  }
`;

export const ChatAvatar: FC<{ isUser: boolean }> = ({
                                                      isUser,
}) => (
  <Avatar $isUser={isUser}>
    {isUser ? (
      <User size={20} />
    ) : (
      <Image
        src="/images/chat-avatar.png"
        alt="Fabrizio Duroni"
        width={40}
        height={40}
      />
    )}
  </Avatar>
);
