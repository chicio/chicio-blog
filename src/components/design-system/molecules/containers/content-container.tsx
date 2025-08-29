"use client";

import styled from "styled-components";
import { Container } from "../../atoms/containers/container";

export const ContentContainer = styled(Container)`
  margin-top: ${(props) => props.theme.spacing[12]};
  flex: 1 0 auto;
`;

export const CenterContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

export const ContentContainerRecentPosts = styled.div`
  margin-top: ${(props) => props.theme.spacing[12]};
  margin-bottom: ${(props) => props.theme.spacing[12]};
`;

export const FreeLayoutContentContainer = styled.div`
  margin-top: ${(props) => props.theme.spacing[7]};
`;