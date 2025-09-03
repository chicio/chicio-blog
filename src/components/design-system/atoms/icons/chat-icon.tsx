"use client";

import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";
import { BiChat } from "react-icons/bi";
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
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
`;

export const ChatIcon = () => (
  <AnimatedRoundedIcon>
    <ChatIconContainer>
      <BiChat className="size-5 md:size-7" />
    </ChatIconContainer>
  </AnimatedRoundedIcon>
);
