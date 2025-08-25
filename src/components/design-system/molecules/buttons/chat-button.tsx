"use client";

import { slugs } from "@/types/slug";
import Link from "next/link";
import styled from "styled-components";
import { usePathname } from "next/navigation";
import { ChatIcon } from "../../atoms/icons/chat-icon";
import { mediaQuery } from "../../utils/media-query";

export const ChatButton = () => (
  <Link target="_blank" href={slugs.chat} passHref>
    <ChatIcon />
  </Link>
);

const FixedIconContainer = styled.div`
  position: fixed;
  z-index: 100;
  bottom: ${(props) => props.theme.spacing[2]};
  right: ${(props) => props.theme.spacing[2]};
  
  ${mediaQuery.minWidth.md} {
    bottom: ${(props) => props.theme.spacing[4]};
    right: ${(props) => props.theme.spacing[8]};
  }
`;

export const FloatingChatButton = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/chat")) {
    return null;
  }

  return (
    <FixedIconContainer>
      <Link aria-label="chat" target="_blank" href={slugs.chat} passHref >
        <ChatIcon />
      </Link>
    </FixedIconContainer>
  );
};
