'use client'

import styled from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";

export const Heading1 = styled.h1`
  font-size: ${(props) => props.theme.fontSizes[12]};
  ${headingStyle}
`;
