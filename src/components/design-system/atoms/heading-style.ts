'use client'

import { css } from "styled-components";

export const headingStyle = css`
  line-height: 1.4;
  color: ${(props) => props.theme.dark.accentColor};
  margin: ${(props) => props.theme.spacing[0]};
`;
