import { BiUser } from "react-icons/bi";
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
      ? props.theme.colors.primaryColor
      : props.theme.colors.generalBackgroundLight};
  color: ${(props) =>
    props.$isUser
      ? props.theme.colors.textAbovePrimaryColor
      : props.theme.colors.primaryTextColor};
  overflow: hidden;

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
      <BiUser className="size-5" />
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
