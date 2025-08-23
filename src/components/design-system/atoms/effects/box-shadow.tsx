import { css } from "styled-components";

export const boxShadow = css`
  box-shadow:
    0px 0px 16px ${(props) => props.theme.dark.accentColor}66,
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A; 
`