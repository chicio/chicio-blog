'use client'

import styled, { css } from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";
import { mediaQuery } from "../utils/media-query";

export const heading5Style = css`
  font-size: ${(props) => props.theme.fontSizes[5]};
  ${headingStyle}
  
  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[7]};
  }  
`;

export const Heading5 = styled.h5`
  font-size: ${(props) => props.theme.fontSizes[7]};
  ${headingStyle}
`;
