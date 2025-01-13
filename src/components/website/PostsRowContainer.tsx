'use client'

import styled from "styled-components";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";

export const PostsRowContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${mediaQuery.minWidth.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`;
