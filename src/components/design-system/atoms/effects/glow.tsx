import { boxShadow } from "./box-shadow";
import { borderColor, borderHover, borderRadius } from "./border";
import { css } from "styled-components";

export const glowContainer = css`
  ${boxShadow};
  ${borderRadius};
  ${borderColor};
  ${borderHover};
`;

export const glowText = css`
  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}80,
    0 0 10px ${(props) => props.theme.dark.accentColor}40;
`
