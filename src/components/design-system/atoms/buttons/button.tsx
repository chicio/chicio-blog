"use client";

import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";
import { glassmorphism } from "../effects/glassmorphism";

export const Button = styled.button`
  ${glassmorphism};
  background-color: transparent;
  padding: ${(props) => props.theme.spacing[2]}
    ${(props) => props.theme.spacing[2]};
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.sm} {
    padding: ${(props) => props.theme.spacing[4]}
      ${(props) => props.theme.spacing[4]};
  }
`;
