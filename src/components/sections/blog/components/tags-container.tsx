'use client'

import { ContainerFluid } from "@/components/design-system/atoms/containers/container-fluid";
import styled from "styled-components";

export const TagsContainer = styled(ContainerFluid)`
  padding: 0;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;
