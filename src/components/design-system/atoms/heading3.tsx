'use client'

import styled, { css } from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";

export const heading3Style = css`
  font-size: ${(props) => props.theme.fontSizes[9]};
  ${headingStyle}
`;

export const Heading3 = styled.h3`
  ${heading3Style}
`;
