"use client";

import styled from "styled-components";
import { FC } from "react";
import { motion, Variants } from "framer-motion";
import { tracking } from "@/types/tracking";
import { SocialContacts } from "@/components/design-system/organism/social-contacts";
import { ContainerFullscreen } from "@/components/design-system/atoms/container-fullscreen";
import { GlassmorphismBackground } from "@/components/design-system/atoms/glassmorphism-background";
import { ProfilePhoto } from "@/components/home/components/profile-photo";
import { ProfileAuthor } from "@/components/home/components/profile-author";
import { ProfileJob } from "@/components/home/components/profile-job";
import { ProfileCTAs } from "@/components/home/components/profile-ctas";

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
        <ProfileAuthor>{author}</ProfileAuthor>
      </motion.div>
      <motion.div variants={itemVariants}>
        <ProfileJob>Software Engineer</ProfileJob>
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
