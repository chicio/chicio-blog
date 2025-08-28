import { css } from "styled-components";

export const hideScrollbar = css`
  &::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`;