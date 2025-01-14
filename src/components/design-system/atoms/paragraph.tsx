'use client'

import styled, {css} from "styled-components";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";

export const paragraphStyle = css`
  font-size: ${(props) => props.theme.fontSizes[2]};
  color: ${(props) => props.theme.light.primaryTextColor};
  margin: ${(props) => props.theme.spacing[0]};
  line-height: ${(props) => props.theme.lineHeight};

  ${mediaQuery.dark} {
    color: ${(props) => props.theme.dark.primaryTextColor};
  }
`

export const Paragraph = styled.p`
  ${paragraphStyle}
`;
