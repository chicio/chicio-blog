"use client";

import { headingStyle } from "@/components/design-system/atoms/heading-style";
import styled, { css } from "styled-components";
import { mediaQuery } from "../utils/media-query";

export const heading4Style = css`
  font-size: ${(props) => props.theme.fontSizes[6]};
  ${headingStyle}

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[8]};
  }
`;

export const Heading4 = styled.h4`
  ${heading4Style}
`;
