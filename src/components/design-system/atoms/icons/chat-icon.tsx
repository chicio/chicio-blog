'use client'

import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";
import { Chat } from "@styled-icons/boxicons-regular";
import { RoundedIcon } from "../effects/icon";
import { pulse } from "../../utils/animations/pulse-keyframes";

const AnimatedRoundedIcon = styled(RoundedIcon)`
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    animation-duration: 1s;
  }
    
  animation: ${pulse} 2s infinite;
`;

const ChatIconContainer = styled.div`
  width: 24px;
  height: 24px;
  color: ${(props) => props.theme.dark.textAbovePrimaryColor};

  ${mediaQuery.minWidth.md} {
    width: 28px;
    height: 28px;
  }
`;

export const ChatIcon = () => (
  <AnimatedRoundedIcon>
    <ChatIconContainer>
      <Chat />
    </ChatIconContainer>
  </AnimatedRoundedIcon>
);