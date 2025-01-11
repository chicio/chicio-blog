'use client'

import styled from "styled-components";
import {Container} from "@/components/design-system/atoms/container";

export const ContainerSection = styled(Container)`
  padding: ${(props) => props.theme.spacing[2]} 0;
`;
