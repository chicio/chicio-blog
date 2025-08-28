"use client";

import { ChevronDown } from "@styled-icons/boxicons-regular";
import styled from "styled-components";
import { bounce } from "../../utils/animations/bounce-keyframes";
import { mediaQuery } from "../../utils/media-query";
import { RoundedIcon } from "../effects/icon";

const FloatingArrowContainer = styled(RoundedIcon)`
  position: fixed;
  bottom: ${(props) => props.theme.spacing[2]};
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 1000;
  width: 40px;
  height: 40px;

  animation: ${bounce} 2s ease-in-out infinite;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 20px ${(props) => props.theme.colors.accentColor}80;
  }

  ${mediaQuery.minWidth.md} {
    bottom: ${(props) => props.theme.spacing[4]};
    width: 50px;
    height: 50px;
  }
`;

const ArrowIcon = styled.div`
  width: 30px;
  height: 30px;
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQuery.minWidth.md} {
    width: 50px;
    height: 50px;
  }
`;

export const DownArrow = () => (
  <FloatingArrowContainer>
    <ArrowIcon>
      <ChevronDown size={100} title="Scroll to next section" />
    </ArrowIcon>
  </FloatingArrowContainer>
);
