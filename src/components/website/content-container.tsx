"use client";

import styled from "styled-components";
import { Container } from "@/components/design-system/atoms/container";

export const ContentContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing[12]};
  flex: 1 0 auto;
`;

export const ContentContainerRecentPosts = styled.div`
  margin-top: ${(props) => props.theme.spacing[12]};
  margin-bottom: ${(props) => props.theme.spacing[12]};
`;
