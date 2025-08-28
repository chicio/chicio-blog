'use client'

import styled from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/typography/heading-style";
import { mediaQuery } from "../../utils/media-query";

export const Heading7 = styled.h6`
  font-size: ${(props) => props.theme.fontSizes[3]};
  ${headingStyle}

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[5]};
  }  
`;
