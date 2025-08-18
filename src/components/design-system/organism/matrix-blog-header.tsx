"use client";

import { FC } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import { ContainerFullscreen } from "@/components/design-system/atoms/container-fullscreen";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";
import { MatrixRain } from "@/components/design-system/atoms/matrix-rain";
import { MatrixBlogLogo } from "@/components/design-system/molecules/matrix-blog-logo";
import { MatrixBlogText } from "@/components/design-system/molecules/matrix-blog-text";

const HeaderContainer = styled(ContainerFullscreen)`
  position: relative;
  min-height: 200px;
  padding: ${(props) => props.theme.spacing[4]};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${mediaQuery.minWidth.sm} {
    min-height: 300px;
    padding: ${(props) => props.theme.spacing[6]};
  }

  ${mediaQuery.minWidth.md} {
    min-height: 400px;
    padding: ${(props) => props.theme.spacing[8]};
  }
`;

const BackgroundRain = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  display: none;

  ${mediaQuery.minWidth.md} {
    display: block;
  }
`;

const MobileBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  background: linear-gradient(
    135deg,
    ${(props) => props.theme.dark.primaryColorDark} 0%,
    ${(props) => props.theme.dark.primaryColor} 50%,
    ${(props) => props.theme.dark.primaryColorDark} 100%
  );
  opacity: 0.3;

  ${mediaQuery.minWidth.md} {
    display: none;
  }
`;

const ContentWrapper = styled(motion.div)`
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${(props) => props.theme.spacing[3]};
  
  ${mediaQuery.minWidth.sm} {
    gap: ${(props) => props.theme.spacing[4]};
  }
`;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const contentVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

export const MatrixBlogHeader: FC = () => (
  <HeaderContainer>
    {/* Desktop Matrix Rain Background */}
    <BackgroundRain>
      <MatrixRain fontSize={14} speed={60} density={0.8} />
    </BackgroundRain>
    
    {/* Mobile Gradient Background */}
    <MobileBackground />
    
    <ContentWrapper
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <GlassmorphismBackground>
        <motion.div variants={contentVariants}>
          <HeaderContent>
            <MatrixBlogLogo />
            <MatrixBlogText />
          </HeaderContent>
        </motion.div>
      </GlassmorphismBackground>
    </ContentWrapper>
  </HeaderContainer>
);
