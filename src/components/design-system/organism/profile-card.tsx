"use client";

import { GlassmorphismBackground } from "@/components/design-system/atoms/effects/glassmorphism-background";
import { SocialContacts } from "@/components/design-system/organism/social-contacts";
import { tracking } from "@/types/tracking";
import { motion, Variants } from "framer-motion";
import { FC } from "react";
import { ProfilePhoto } from "./profile-photo";

const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
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

export interface ProfileCardProps {
    author: string;
    title?: string;
    subtitle?: string;
    showSocialContacts?: boolean;
    trackingCategory?: string;
    trackingLabel?: string;
}

/**
 * Compact profile card component suitable for inline use in articles/pages
 * Reuses the same visual style as ProfilePresentation but without full viewport height
 */
export const ProfileCard: FC<ProfileCardProps> = ({
    author,
    title = "Software Engineer",
    subtitle,
    showSocialContacts = false,
    trackingCategory = tracking.category.blog,
    trackingLabel = tracking.label.body,
}) => (
    <div className="w-full py-8 flex items-center justify-center">
        <GlassmorphismBackground>
            <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
            >
                <ProfilePhoto author={author} />
            </motion.div>
            <motion.div variants={itemVariants}>
                <h2 className="mx-0 mt-3 text-center text-primary-text">{author}</h2>
            </motion.div>
            <motion.div variants={itemVariants}>
                <p className="text-center text-secondary-text mt-0 mr-0 mb-0 ml-0">
                    {title}
                </p>
            </motion.div>
            {subtitle && (
                <motion.div variants={itemVariants}>
                    <p className="text-center text-secondary-text text-sm mt-1 mb-0">
                        {subtitle}
                    </p>
                </motion.div>
            )}
            {showSocialContacts && (
                <motion.div variants={itemVariants} className="mt-6">
                    <SocialContacts
                        trackingCategory={trackingCategory}
                        trackingLabel={trackingLabel}
                    />
                </motion.div>
            )}
        </GlassmorphismBackground>
    </div>
);
