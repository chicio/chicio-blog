"use client";

import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { SocialContacts } from "@/components/design-system/organism/social-contacts";
import { tracking } from "@/types/configuration/tracking";
import { motion, Variants } from "framer-motion";
import { FC } from "react";
import { ProfilePhoto } from "../../../design-system/organism/profile-photo";

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
  <div className="h-dvh w-full p-5 relative flex items-center justify-center flex-col bg-transparent">
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
    </GlassmorphismBackground>
  </div>
);
