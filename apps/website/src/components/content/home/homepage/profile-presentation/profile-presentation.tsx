"use client";

import { GlassmorphismBackground, MotionDiv } from "matrix-design-system";
import { SocialContacts } from "@/components/features/design-system-next/social-contacts";
import { Variants } from "framer-motion";
import { FC } from "react";
import { ProfilePhoto } from "@/components/features/design-system-next/profile-photo";
import { useProfilePresentationStore } from "./use-profile-presentation-store";
import { socialContactLinks } from "@/components/features/content/nav-config";
import { slugs } from "@/types/configuration/slug";

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

export const ProfilePresentation: FC<ProfilePresentationProps> = ({ author }) => {
    const { effects } = useProfilePresentationStore();
    const {
        onTrackGithub,
        onTrackLinkedin,
        onTrackContact,
        onTrackMedium,
        onTrackDevto,
        onTrackTwitter,
        onTrackFacebook,
        onTrackInstagram,
    } = effects;

    return (
        <div className="relative flex h-dvh w-full flex-col items-center justify-center bg-transparent p-5">
            <GlassmorphismBackground>
                <MotionDiv
                    variants={itemVariants}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring" as const, stiffness: 300, damping: 20 }}
                >
                    <ProfilePhoto author={author} />
                </MotionDiv>
                <MotionDiv variants={itemVariants}>
                    <h1 className="text-primary-text mx-0 mt-3 text-center">{author}</h1>
                </MotionDiv>
                <MotionDiv variants={itemVariants}>
                    <h2 className="text-secondary-text mt-0 mr-0 mb-6 ml-0 text-center text-2xl!">Software Engineer</h2>
                </MotionDiv>
                <MotionDiv variants={itemVariants}>
                    <SocialContacts
                        links={socialContactLinks}
                        contactHref={slugs.contact}
                        onTrackGithub={onTrackGithub}
                        onTrackLinkedin={onTrackLinkedin}
                        onTrackContact={onTrackContact}
                        onTrackMedium={onTrackMedium}
                        onTrackDevto={onTrackDevto}
                        onTrackTwitter={onTrackTwitter}
                        onTrackFacebook={onTrackFacebook}
                        onTrackInstagram={onTrackInstagram}
                    />
                </MotionDiv>
            </GlassmorphismBackground>
        </div>
    );
};
