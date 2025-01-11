'use client'

import styled, { css } from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";

export const heading4Style = css`
  font-size: ${(props) => props.theme.fontSizes[8]};
  ${headingStyle}
`;

export const Heading4 = styled.h4`
  ${heading4Style}
`;
