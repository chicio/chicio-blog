"use client";

import { css } from "styled-components";
import { mediaQuery } from "../../utils/media-query";

export const borderRadius = css`
  border-radius: ${(props) => props.theme.spacing[2]};
`;

export const borderColor = css`
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
`;

export const borderHover = css`
  transition: transform 0.35s;

  ${mediaQuery.inputDevice.mouse} {
    &:hover {
      border-color: ${(props) => props.theme.dark.accentColor};
      transform: scale(1.02) !important;
    }
  }
`;
