"use client";

import { FC } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { MatrixBlogLogo } from "@/components/design-system/molecules/matrix-blog-logo";
import { MatrixBlogText } from "@/components/design-system/molecules/matrix-blog-text";

const MobileHeaderContainer = styled.div<{ height: string }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: ${(props) => props.height};
  width: 100%;
  padding: 0 ${(props) => props.theme.spacing[3]};
  background: ${(props) => props.theme.dark.primaryColorDark};
  gap: ${(props) => props.theme.spacing[2]};
`;

const CompactLogoWrapper = styled.div`
  flex-shrink: 0;
  
  /* Override logo size for mobile header */
  img {
    width: 32px !important;
    height: 32px !important;
  }
`;

const CompactTextWrapper = styled.div`
  flex: 1;
  overflow: hidden;
  
  /* Override text styling for compact mobile header */
  h1 {
    font-size: ${(props) => props.theme.fontSizes[3]} !important;
    margin: 0 !important;
    line-height: 1.2 !important;
  }
  
  /* Hide description in mobile header */
  div:last-child {
    display: none !important;
  }
`;

interface MatrixMobileBlogHeaderProps {
  height: string;
}

export const MatrixMobileBlogHeader: FC<MatrixMobileBlogHeaderProps> = ({ 
  height 
}) => (
  <MobileHeaderContainer height={height}>
    <CompactLogoWrapper>
      <MatrixBlogLogo />
    </CompactLogoWrapper>
    <CompactTextWrapper>
      <MatrixBlogText />
    </CompactTextWrapper>
  </MobileHeaderContainer>
);
