"use client";

import { FC } from "react";
import styled from "styled-components";
import Image from "next/image";
import { motion } from "framer-motion";
import { mediaQuery } from "@/components/design-system/utils-css/media-query";
import blogLogoImage from "../../../../public/images/blog-logo.jpg";

const LogoContainer = styled(motion.div)`
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  margin-right: ${(props) => props.theme.spacing[3]};
  
  /* Base glow effect */
  box-shadow: 
    0 0 10px ${(props) => props.theme.dark.accentColor}33,
    inset 0 1px 0 ${(props) => props.theme.dark.accentColor}1A;
  border: 1px solid ${(props) => props.theme.dark.accentColor}40;
  
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  ${mediaQuery.minWidth.md} {
    ${mediaQuery.inputDevice.mouse} {
      &:hover {
        transform: scale(1.03) translateY(-4px);
        box-shadow:
          0 0 15px ${(props) => props.theme.dark.accentColor}99,
          0 0 25px ${(props) => props.theme.dark.accentColor}66,
          inset 0 1px 0 rgba(255, 255, 255, 0.15);
        border-color: ${(props) => props.theme.dark.accentColor}80;
      }
    }
  }
`;

const StyledImage = styled(Image)`
  width: 35px;
  height: 35px;
  border-radius: 12px;
  object-fit: cover;
  display: block;

  ${mediaQuery.minWidth.sm} {
    width: 80px;
    height: 80px;
  }
`;

export const MatrixBlogLogo: FC = () => (
  <LogoContainer
    whileHover={{ scale: 1.03 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <StyledImage
      src={blogLogoImage}
      alt="Blog logo"
      width={80}
      height={80}
      placeholder="blur"
      priority
    />
  </LogoContainer>
);
