"use client";

import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";

export const RoundedIcon = styled.div`
  z-index: 1000;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => props.theme.colors.accentColor};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQuery.minWidth.md} {
    width: 50px;
    height: 50px;
  }
`;
