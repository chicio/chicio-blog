"use client";

import { ChevronDown } from "@styled-icons/boxicons-regular";
import styled from "styled-components";
import { mediaQuery } from "../../utils/media-query";

const ArrowIcon = styled.div`
  width: 30px;
  height: 30px;
  color: ${(props) => props.theme.colors.textAbovePrimaryColor};
  display: flex;
  align-items: center;
  justify-content: center;

  ${mediaQuery.minWidth.md} {
    width: 50px;
    height: 50px;
  }
`;

export const DownArrowIcon = () => (
    <ArrowIcon>
      <ChevronDown size={100} title="Scroll to next section" />
    </ArrowIcon>
);
