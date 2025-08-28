"use client";

import { FC, PropsWithChildren } from "react";
import { BluePill, RedPill } from "../../atoms/effects/pills";
import styled from "styled-components";

type PillProps = PropsWithChildren<{
  onClick: () => void;
}>;

const StyledButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
`;

export const RedPillButton: FC<PillProps> = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>
    <RedPill>{children}</RedPill>
  </StyledButton>
);

export const BluePillButton: FC<PillProps> = ({ children, onClick }) => (
  <StyledButton onClick={onClick}>
    <BluePill>{children}</BluePill>
  </StyledButton>
);