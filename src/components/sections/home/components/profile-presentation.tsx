"use client";

import styled from "styled-components";
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { tracking } from "@/types/tracking";
import { SocialContacts } from "@/components/design-system/organism/social-contacts";
import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { ProfilePhoto } from "./profile-photo";
import { ProfileCTAs } from "./profile-ctas";
import { ContainerFullscreen } from "@/components/design-system/atoms/containers/container-fullscreen";

const ContentContainer = styled(ContainerFullscreen)`
  padding: ${(props) => props.theme.spacing[4]};
  position: relative;
`;

const itemVariants: Variants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
};

export interface ProfilePresentationProps {
  author: string;
}

export const ProfilePresentation: FC<ProfilePresentationProps> = ({
  author,
}) => (
  <ContentContainer>
    <GlassmorphismBackground>
      <motion.div
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
      >
        <ProfilePhoto author={author} />
      </motion.div>
      <motion.div variants={itemVariants}>
        <h1 className="mx-0 mt-3 text-center text-primary-text">{author}</h1>
      </motion.div>
      <motion.div variants={itemVariants}>
        <h3 className="text-center text-secondary-text mt-0 mr-0 mb-6 ml-0">
          Software Engineer
        </h3>
      </motion.div>
      <motion.div variants={itemVariants}>
        <SocialContacts
          trackingCategory={tracking.category.home}
          trackingLabel={tracking.label.body}
        />
      </motion.div>
      <motion.div variants={itemVariants}>
        <ProfileCTAs />
      </motion.div>
    </GlassmorphismBackground>
  </ContentContainer>
);
