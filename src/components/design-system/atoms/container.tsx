'use client'

import styled from "styled-components";
import {ContainerFluid} from "@/components/design-system/atoms/container-fluid";
import {mediaQuery} from "@/components/design-system/utils/media-query";

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
