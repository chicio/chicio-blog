'use client'

import styled from "styled-components";
import {headingStyle} from "@/components/design-system/atoms/heading-style";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";

export const Heading1 = styled.h1`
  font-size: ${(props) => props.theme.fontSizes[9]};
  ${headingStyle}

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[11]};
  }
`;
