'use client'

import styled from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";

export const Heading6 = styled.h6`
  font-size: ${(props) => props.theme.fontSizes[6]};
  ${headingStyle}
`;
