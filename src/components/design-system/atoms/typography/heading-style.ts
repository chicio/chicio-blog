'use client'

import { css } from "styled-components";
import { glowText } from "../effects/glow";

export const headingStyle = css`
  line-height: 1.4;
  color: ${(props) => props.theme.dark.accentColor};
  margin: ${(props) => props.theme.spacing[0]};
  ${glowText};
`;
