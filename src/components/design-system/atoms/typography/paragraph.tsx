'use client'

import styled, {css} from "styled-components";

export const paragraphStyle = css`
  font-size: ${(props) => props.theme.fontSizes[2]};
  color: ${(props) => props.theme.dark.primaryTextColor};
  margin: ${(props) => props.theme.spacing[0]};
  line-height: ${(props) => props.theme.lineHeight};
`

export const Paragraph = styled.p`
  ${paragraphStyle}
`;
