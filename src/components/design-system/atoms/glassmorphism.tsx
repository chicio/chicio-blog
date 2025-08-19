import { css } from "styled-components";

export const glassmorphism = css`
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: ${(props) => props.theme.spacing[2]};
  border: 1px solid ${(props) => props.theme.dark.accentColor}40; // Using theme color with hex opacity
  box-shadow:
    0 8px 32px ${(props) => props.theme.dark.boxShadowLight},
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A; // 10% opacity
`