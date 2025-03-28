'use client'

import styled, { TransientProps } from "styled-components";
import { opacity } from "../utils-css/opacity-keyframes";
import {FC, ReactNode} from "react";
import {useLockBodyScroll} from "@/components/design-system/hooks/use-lock-body-scroll";

export interface OverlayProps {
  zIndex: number;
  delay: string;
  onClick: () => void;
  children?: ReactNode;
}

const StyledOverlay = styled.div<TransientProps<OverlayProps, "div">>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${(props) => props.$zIndex};
  background: rgba(0, 0, 0, 0.6);
  opacity: 0;
  animation: ${opacity} 0.25s linear ${(props) => `${props.$delay}`};
  animation-fill-mode: forwards;
  backdrop-filter: blur(4px);
`;

export const Overlay: FC<OverlayProps> = ({ zIndex, onClick, delay, children }) => {
  useLockBodyScroll();

  return <StyledOverlay $zIndex={zIndex} onClick={onClick} $delay={delay}>
    {children}
  </StyledOverlay>;
};
