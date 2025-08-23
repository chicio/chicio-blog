"use client";

import styled from "styled-components";
import { headingStyle } from "@/components/design-system/atoms/heading-style";
import { mediaQuery } from "../utils/media-query";

export const Heading6 = styled.h6`
  font-size: ${(props) => props.theme.fontSizes[4]};
  ${headingStyle}

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[6]};
  }
`;
