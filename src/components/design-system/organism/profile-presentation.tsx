'use client'

import styled, { keyframes } from "styled-components";
import { FC } from "react";
import Image from "next/image";
import { motion, stagger, Variants } from "framer-motion";
import {CallToActionInternalWithTracking} from "@/components/design-system/atoms/call-to-action-internal-with-tracking";
import {tracking} from "@/types/tracking";
import {slugs} from "@/types/slug";
import {mediaQuery} from "@/components/design-system/utils-css/media-query";
import {SocialContacts} from "@/components/design-system/organism/social-contacts";
import { ContainerFullscreen } from "@/components/design-system/atoms/container-fullscreen";

// Matrix glow effect for profile photo
const matrixGlow = keyframes`
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
`;

// Glassmorphism container using theme colors
const GlassmorphismContainer = styled(motion.div)`
  position: relative;
  z-index: 2;
  background: ${props => props.theme.dark.generalBackground}1A; // Using theme background with 10% opacity
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 24px;
  border: 1px solid ${props => props.theme.dark.accentColor}40; // Using theme color with hex opacity
  padding: ${props => props.theme.spacing[8]};
  box-shadow: 
    0 8px 32px ${props => props.theme.dark.boxShadowLight},
    inset 0 1px 0 ${props => props.theme.dark.accentColor}1A; // 10% opacity

  ${mediaQuery.minWidth.md} {
    padding: ${props => props.theme.spacing[12]};
  }
`;

const Author = styled(motion.h1)`
  font-size: ${props => props.theme.fontSizes[10]};
  font-weight: bold;
  margin: ${props => props.theme.spacing[4]} 0;
  text-align: center;
  color: ${props => props.theme.dark.primaryTextColor};

  ${mediaQuery.minWidth.md} {
    font-size: ${props => props.theme.fontSizes[12]};
  }
`;

const Job = styled(motion.h2)`
  font-size: ${props => props.theme.fontSizes[4]};
  color: ${props => props.theme.dark.secondaryTextColor};
  margin: ${props => props.theme.spacing[2]} 0 ${props => props.theme.spacing[6]} 0;
  text-align: center;
  opacity: 0.9;

  ${mediaQuery.minWidth.md} {
    font-size: ${props => props.theme.fontSizes[5]};
  }
`;

const CTAContainer = styled(motion.div)`
  display: flex;
  gap: ${props => props.theme.spacing[4]};
  justify-content: center;
  flex-wrap: wrap;
  margin-top: ${props => props.theme.spacing[6]};
`;

const HomeCallToAction = styled(CallToActionInternalWithTracking)`
  min-width: 120px;
  background: linear-gradient(135deg, 
    ${props => props.theme.dark.primaryColor} 0%, 
    ${props => props.theme.dark.accentColor} 100%
  );
  border: 1px solid ${props => props.theme.dark.accentColor};
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 255, 65, 0.4);
  }
`;

const ProfilePhoto = styled(motion.div)`
  width: 160px;
  height: 160px;
  border-radius: 50%;
  margin: 0 auto ${props => props.theme.spacing[6]} auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    border-radius: 50%;
    background: linear-gradient(45deg, 
      ${props => props.theme.dark.accentColor}, 
      ${props => props.theme.dark.primaryColor},
      ${props => props.theme.dark.accentColor}
    );
    z-index: -1;
    animation: ${matrixGlow} 2s ease-in-out infinite;
  }

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  ${mediaQuery.minWidth.md} {
    width: 200px;
    height: 200px;
  }
`;

const ContentContainer = styled(ContainerFullscreen)`
  padding: ${props => props.theme.spacing[4]};
`;

export interface ProfilePresentationProps {
  author: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: stagger(0.15),
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12
    }
  }
};

export const ProfilePresentation: FC<ProfilePresentationProps> = ({
  author,
}) => (
  <ContentContainer>
    <GlassmorphismContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <ProfilePhoto
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      >
        <Image
          src="/images/authors/fabrizio-duroni.jpg"
          alt={author}
          width={200}
          height={200}
          priority
        />
      </ProfilePhoto>

      <Author variants={itemVariants}>
        {author}
      </Author>

      <Job variants={itemVariants}>
        Software Developer
      </Job>

      <motion.div variants={itemVariants}>
        <SocialContacts
          trackingCategory={tracking.category.home}
          trackingLabel={tracking.label.body}
        />
      </motion.div>

      <CTAContainer variants={itemVariants}>
        <HomeCallToAction
          trackingData={{
            action: tracking.action.open_blog,
            category: tracking.category.home,
            label: tracking.label.body,
          }}
          to={slugs.blog}
        >
          Blog
        </HomeCallToAction>
        <HomeCallToAction
          trackingData={{
            action: tracking.action.open_art,
            category: tracking.category.home,
            label: tracking.label.body,
          }}
          to={slugs.art}
        >
          Art
        </HomeCallToAction>
      </CTAContainer>
    </GlassmorphismContainer>
  </ContentContainer>
);
