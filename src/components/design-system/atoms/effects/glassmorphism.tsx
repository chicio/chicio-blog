import { css } from "styled-components";
import { glowContainer } from "./glow";

export const glassmorphism = css`
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  ${glowContainer};
`;
