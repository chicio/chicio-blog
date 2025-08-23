"use client";

import styled from "styled-components";

export const List = styled.ul`
  font-size: ${(props) => props.theme.fontSizes[2]};
  color: ${(props) => props.theme.dark.primaryTextColor};
  line-height: ${(props) => props.theme.lineHeight};
  list-style: none;

  li {
    position: relative;
    padding-left: ${(props) => props.theme.spacing[4]};
     margin-bottom: ${(props) => props.theme.spacing[2]};

    &::before {
      content: "▸";
      position: absolute;
      left: 0;
      color: ${(props) => props.theme.dark.primaryColor};
      font-weight: bold;
    }
  }
`;
