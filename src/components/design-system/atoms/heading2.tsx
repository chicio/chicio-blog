'use client'

import styled, { css } from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";

export const heading2Style = css`
  font-size: ${(props) => props.theme.fontSizes[10]};
  ${headingStyle}
`

export const Heading2 = styled.h2`
  ${heading2Style}
`;
