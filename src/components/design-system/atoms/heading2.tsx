'use client'

import styled, { css } from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";

export const heading2Style = css`
  font-size: ${(props) => props.theme.fontSizes[8]};
  ${headingStyle}
  
  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[10]};
  }
`

export const Heading2 = styled.h2`
  ${heading2Style}
`;
