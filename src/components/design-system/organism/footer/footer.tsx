"use client";

import { slugs } from "@/types/configuration/slug";
import { FC } from "react";
import { MenuItemWithTracking } from "@/components/design-system/molecules/menu/menu-item-with-tracking";
import { SocialContacts } from "@/components/design-system/organism/social-contacts";
import { Cursor, TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useFooterStore } from "./use-footer-store";

interface FooterProps {
    author: string;
    onTrackNavigation?: (action: string) => void;
    onTrackSocial?: (action: string) => void;
}

export const Footer: FC<FooterProps> = ({ author, onTrackNavigation, onTrackSocial }) => {
    const { effects } = useFooterStore(onTrackNavigation, onTrackSocial);
    const {
        onTrackHome,
        onTrackBlog,
        onTrackArt,
        onTrackAboutMe,
        onTrackArchive,
        onTrackTags,
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
        <footer className="bg-primary-dark border-t-accent relative w-full shrink-0 snap-start border-t-2 border-solid shadow-lg">
            <div className="flex flex-col w-full items-center">
                <div className="grid grid-cols-2 gap-3 py-7 px-5 w-full sm:grid-cols-[repeat(6,auto)] sm:justify-center sm:max-w-4xl sm:mx-auto">
                    <MenuItemWithTracking to="/" onClick={onTrackHome} selected={false}>
                        Home
                    </MenuItemWithTracking>
                    <MenuItemWithTracking to={slugs.blog.home} onClick={onTrackBlog} selected={false}>
                        Blog
                    </MenuItemWithTracking>
                    <MenuItemWithTracking to={slugs.art} onClick={onTrackArt} selected={false}>
                        Art
                    </MenuItemWithTracking>
                    <MenuItemWithTracking to={slugs.aboutMe} onClick={onTrackAboutMe} selected={false}>
                        About Me
                    </MenuItemWithTracking>
                    <MenuItemWithTracking to={slugs.blog.blogArchive} onClick={onTrackArchive} selected={false}>
                        Archive
                    </MenuItemWithTracking>
                    <MenuItemWithTracking to={slugs.blog.tags} onClick={onTrackTags} selected={false}>
                        Tags
                    </MenuItemWithTracking>
                </div>
                <hr />
                <div className="w-full flex flex-col items-center justify-center gap-3 py-6 px-4 bg-gradient-to-b from-general-background-light to-primary-color-dark">
                    <SocialContacts
                        onTrackGithub={onTrackGithub}
                        onTrackLinkedin={onTrackLinkedin}
                        onTrackContact={onTrackContact}
                        onTrackMedium={onTrackMedium}
                        onTrackDevto={onTrackDevto}
                        onTrackTwitter={onTrackTwitter}
                        onTrackFacebook={onTrackFacebook}
                        onTrackInstagram={onTrackInstagram}
                    />
                    <TerminalLine>
                        {`> Made with 💝 by ${author} 'Chicio'`}
                        <Cursor />
                    </TerminalLine>
                </div>
            </div>
        </footer>
    );
};
