'use client'

import styled, { css } from "styled-components";

export const quoteStyle = css`
  color: ${(props) => props.theme.dark.accentColor};
  font-style: italic;
`
  
  export const Quote = styled.blockquote`
  ${quoteStyle};
  text-align: center;
  position: relative;
  margin: ${(props) => props.theme.spacing[2]} 0;
  
  &::before,
  &::after {
    content: '"';
    font-size: 1.5em;
    color: ${(props) => props.theme.dark.accentColor};
    opacity: 0.6;
  }
  
  &::before {
    margin-right: 0.25em;
  }
  
  &::after {
    margin-left: 0.25em;
  }
`;
