"use client";

import { FC, PropsWithChildren } from "react";
import styled from "styled-components";
<<<<<<< HEAD
import { mediaQuery } from "../../utils/media-query";
=======
>>>>>>> a281755939ffee136f2196d23a659f329aefa535

export const PillContainer = styled.div<{ $color: "red" | "blue" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 50px;
  border-radius: 25px;
  text-decoration: none;
<<<<<<< HEAD
=======
  font-weight: 700;
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
<<<<<<< HEAD
    backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  background: ${(props) =>
    props.$color === "red"
      ? `linear-gradient(135deg, ${props.theme.dark.confirmColor}A0 0%, ${props.theme.dark.confirmColor}A0 60%, ${props.theme.dark.confirmColor}40 100%)`
      : `linear-gradient(135deg, ${props.theme.dark.undoColor}A0 0%, ${props.theme.dark.undoColor}A0 60%, ${props.theme.dark.undoColor}40 100%)`};
=======
  background: ${(props) =>
    props.$color === "red"
      ? "linear-gradient(145deg, #ff0000, #cc0000)"
      : "linear-gradient(145deg, #0066ff, #0044cc)"};
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
  color: white;
  border: 2px solid
    ${(props) => (props.$color === "red" ? "#ff0000" : "#0066ff")};
  box-shadow:
    0 4px 15px
      ${(props) => (props.$color === "red" ? "#ff000050" : "#0066ff50")},
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

<<<<<<< HEAD
  &::before {
    content: "";
    position: absolute;
    top: 6px;
    left: 12px;
    right: 12px;
    height: 18px;
    border-radius: 22px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.8) 0%,
      rgba(255, 255, 255, 0.6) 15%,
      rgba(255, 255, 255, 0.1) 100%
    );
    filter: blur(1.5px);
    opacity: 0.85;
    pointer-events: none;
    z-index: 2;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 4px;
    left: 24px;
    right: 24px;
    height: 14px;
    border-radius: 18px;
    background: ${(props) =>
      props.$color === "red"
        ? "radial-gradient(circle at 60% 80%, #fff6 0%, #ff000033 70%, transparent 100%)"
        : "radial-gradient(circle at 40% 80%, #fff6 0%, #0066ff33 70%, transparent 100%)"};
    filter: blur(2px);
    opacity: 0.7;
    pointer-events: none;
    z-index: 2;
  }
=======
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow:
      0 8px 25px
        ${(props) => (props.$color === "red" ? "#ff000070" : "#0066ff70")},
      0 0 20px
        ${(props) => (props.$color === "red" ? "#ff000040" : "#0066ff40")},
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }

  &:active {
    transform: translateY(-1px) scale(1.02);
  }
`;

<<<<<<< HEAD
export const PillLabel = styled.span`
=======
export const PillLabel = styled.div`
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
<<<<<<< HEAD
  text-decoration: none !important;
  width: 100%;
  font-weight: bold;
  color: ${(props) => props.theme.dark.primaryTextColor};
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.85);

  ${mediaQuery.inputDevice.mouse} {
    &:hover {
      text-decoration: none !important;
    }
  }
=======
  text-decoration: none;
  width: 100%;
>>>>>>> a281755939ffee136f2196d23a659f329aefa535
`;

export const RedPill: FC<PropsWithChildren> = ({ children }) => (
  <PillContainer $color="red">
    <PillLabel>{children}</PillLabel>
  </PillContainer>
);

export const BluePill: FC<PropsWithChildren> = ({ children }) => (
  <PillContainer $color="blue">
    <PillLabel>{children}</PillLabel>
  </PillContainer>
);
