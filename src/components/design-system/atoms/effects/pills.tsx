"use client";

import { FC, PropsWithChildren } from "react";
import styled from "styled-components";

export const PillContainer = styled.div<{ $color: "red" | "blue" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
  height: 50px;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 700;
  position: relative;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-align: center;
  background: ${(props) =>
    props.$color === "red"
      ? "linear-gradient(145deg, #ff0000, #cc0000)"
      : "linear-gradient(145deg, #0066ff, #0044cc)"};
  color: white;
  border: 2px solid
    ${(props) => (props.$color === "red" ? "#ff0000" : "#0066ff")};
  box-shadow:
    0 4px 15px
      ${(props) => (props.$color === "red" ? "#ff000050" : "#0066ff50")},
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

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

export const PillLabel = styled.div`
  letter-spacing: 0.5px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-decoration: none;
  width: 100%;
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
