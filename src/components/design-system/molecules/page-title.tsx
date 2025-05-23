'use client'

import styled from "styled-components";
import {Heading1} from "@/components/design-system/atoms/heading1";

export const PageTitle = styled(Heading1)`
  margin-left: 0;
  margin-right: 0;
  margin-bottom: ${(props) => props.theme.spacing[4]};
`;
