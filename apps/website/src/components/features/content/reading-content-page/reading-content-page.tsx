"use client";

import { ReadingContentPageTemplate } from "@/components/features/content/reading-content-page-template";
import type { ReadingContentPageProps as ReadingContentPageTemplateProps } from "@/components/features/content/reading-content-page-template";
import { TheChoiceEasterEgg } from "@/components/features/easter-eggs/the-choice";
import { FC } from "react";
import { useReadingContentPageStore } from "./use-reading-content-page-store";
import { contactHref, socialContactLinks } from "../nav-config";

export type ReadingContentPageProps = Omit<
    ReadingContentPageTemplateProps,
    "menuEntries" | "footerLinks" | "contactHref" | "socialLinks" | "onPaletteTrigger" | "footerSocialTracking"
> & {
    trackingCategory?: string;
};

export const ReadingContentPage: FC<ReadingContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { state, effects } = useReadingContentPageStore(trackingCategory);
    const { menuEntries, footerLinks } = state;
    const { onPaletteTrigger, footerSocialTracking } = effects;

    return (
        <ReadingContentPageTemplate
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
