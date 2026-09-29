"use client";

import { ContentPageTemplate } from "@/components/features/content/content-page-template";
import type { ContentPageProps as ContentPageTemplateProps } from "@/components/features/content/content-page-template";
import { TheChoiceEasterEgg } from "@/components/features/easter-eggs/the-choice";
import { FC } from "react";
import { useContentPageStore } from "./use-content-page-store";
import { contactHref, socialContactLinks } from "../nav-config";

export type ContentPageProps = Omit<
    ContentPageTemplateProps,
    "menuEntries" | "footerLinks" | "contactHref" | "socialLinks" | "onPaletteTrigger" | "footerSocialTracking"
> & {
    trackingCategory: string;
};

export const ContentPage: FC<ContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { state, effects } = useContentPageStore(trackingCategory);
    const { menuEntries, footerLinks } = state;
    const { onPaletteTrigger, footerSocialTracking } = effects;

    return (
        <ContentPageTemplate
            {...rest}
            headerWrapper={TheChoiceEasterEgg}
            menuEntries={menuEntries}
            footerLinks={footerLinks}
            contactHref={contactHref}
            socialLinks={socialContactLinks}
            onPaletteTrigger={onPaletteTrigger}
            footerSocialTracking={footerSocialTracking}
        />
    );
};
