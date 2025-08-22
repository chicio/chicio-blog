"use client";

import { css } from "styled-components";
import { mediaQuery } from "@/components/design-system/utils/media-query";
import { glowText } from "./glow";

export const standardLinkStyle = css`
  font-size: ${(props) => props.theme.fontSizes[2]};
  line-height: ${(props) => props.theme.lineHeight};
  color: ${(props) => props.theme.dark.accentColor};
  transition: transform 0.35s;
  text-decoration: none;

  ${glowText}

  ${mediaQuery.inputDevice.mouse} {
    &:hover {
      text-decoration: underline;
    }
  }
`;
