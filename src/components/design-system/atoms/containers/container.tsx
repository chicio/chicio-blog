'use client'

import styled from "styled-components";
import {mediaQuery} from "@/components/design-system/utils/media-query";
import { ContainerFluid } from "./container-fluid";

export const Container = styled(ContainerFluid)`
  ${mediaQuery.minWidth.xs} {
    max-width: 540px;
  }

  ${mediaQuery.minWidth.sm} {
    max-width: 720px;
  }

  ${mediaQuery.minWidth.md} {
    max-width: 960px;
  }
`;
