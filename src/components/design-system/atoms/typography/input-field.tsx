import styled from "styled-components";
import { borderColor, borderRadius } from "../effects/border";

export const InputField = styled.input`
  background: none;
  ${borderRadius};
  ${borderColor};
  box-sizing: border-box;
  font-size: ${(props) => props.theme.fontSizes[2]};
  outline: none;
  transition: 0.5s;
  color: transparent;
  
  &:focus,
  &:active {
    border: 1px solid ${(props) => props.theme.dark.accentColor};
    color: ${(props) => props.theme.dark.accentColor};
  }
`;
