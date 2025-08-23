"use client";

import styled, { css } from "styled-components";
import { headingStyle } from "@/components/design-system/atoms/heading-style";
import { mediaQuery } from "../utils/media-query";

export const heading3Style = css`
  font-size: ${(props) => props.theme.fontSizes[7]};
  ${headingStyle}

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[9]};
  }
`;

export const Heading3 = styled.h3`
  ${heading3Style}
`;
