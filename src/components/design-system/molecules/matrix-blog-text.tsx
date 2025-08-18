"use client";

import { FC } from "react";
import styled from "styled-components";
import { motion, Variants } from "framer-motion";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";

const TextContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
`;

const BlogTitle = styled(motion.h1)`
  color: ${(props) => props.theme.dark.accentColor};
  margin: 0;
  display: block;
  line-height: 1.2;
  font-size: ${(props) => props.theme.fontSizes[4]};
  font-weight: 700;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  
  /* Matrix glow effect */
  text-shadow: 
    0 0 5px ${(props) => props.theme.dark.accentColor}80,
    0 0 10px ${(props) => props.theme.dark.accentColor}40;

  ${mediaQuery.minWidth.xs} {
    font-size: ${(props) => props.theme.fontSizes[6]};
  }

  ${mediaQuery.minWidth.sm} {
    font-size: ${(props) => props.theme.fontSizes[9]};
  }

  ${mediaQuery.inputDevice.mouse} {
    transition: text-shadow 0.3s ease;
    
    &:hover {
      text-shadow: 
        0 0 8px ${(props) => props.theme.dark.accentColor}CC,
        0 0 15px ${(props) => props.theme.dark.accentColor}80,
        0 0 20px ${(props) => props.theme.dark.accentColor}40;
    }
  }
`;

const BlogDescriptionContainer = styled(motion.div)`
  display: none;
  overflow: hidden;
  margin-top: ${(props) => props.theme.spacing[2]};

  ${mediaQuery.minWidth.sm} {
    display: block;
  }
`;

const BlogDescription = styled.span`
  display: none;

  ${mediaQuery.minWidth.sm} {
    display: block;
    font-size: ${(props) => props.theme.fontSizes[4]};
    color: ${(props) => props.theme.dark.primaryTextColor};
    line-height: 1.5;
    font-weight: 400;
    letter-spacing: 0.25px;
    opacity: 0.9;
    
    /* Subtle glow for description */
    text-shadow: 0 0 3px ${(props) => props.theme.dark.accentColor}20;
  }
`;

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
      staggerChildren: 0.2,
    },
  },
};

const titleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0, 0.2, 1] as const,
    },
  },
};

const descriptionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1] as const,
      delay: 0.3,
    },
  },
};

export const MatrixBlogText: FC = () => (
  <TextContainer
    variants={textVariants}
    initial="hidden"
    animate="visible"
  >
    <BlogTitle variants={titleVariants}>
      CHICIO CODING
    </BlogTitle>
    <BlogDescriptionContainer variants={descriptionVariants}>
      <BlogDescription>
        Coding. Drawing. Fun.
      </BlogDescription>
    </BlogDescriptionContainer>
  </TextContainer>
);
