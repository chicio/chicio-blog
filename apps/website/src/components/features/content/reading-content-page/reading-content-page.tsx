"use client";

import { ReadingContentPageTemplate } from "@/components/features/content/reading-content-page-template";
import type { ReadingContentPageProps as ReadingContentPageTemplateProps } from "@/components/features/content/reading-content-page-template";
import { TheChoiceEasterEgg } from "@/components/features/easter-eggs/the-choice";
import { FC } from "react";
import { useReadingContentPageStore } from "./use-reading-content-page-store";
import { menuNavHrefs, footerNavHrefs, socialContactLinks } from "../nav-config";

export type ReadingContentPageProps = Omit<
    ReadingContentPageTemplateProps,
    | "navHrefs"
    | "footerNavHrefs"
    | "socialLinks"
    | "onPaletteTrigger"
    | "menuTracking"
    | "footerNavTracking"
    | "footerSocialTracking"
> & {
    trackingCategory?: string;
};

export const ReadingContentPage: FC<ReadingContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { effects } = useReadingContentPageStore(trackingCategory);
    const { onPaletteTrigger, menuTracking, footerNavTracking, footerSocialTracking } = effects;

    return (
        <ReadingContentPageTemplate
            {...rest}
            headerWrapper={TheChoiceEasterEgg}
            navHrefs={menuNavHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialContactLinks}
            onPaletteTrigger={onPaletteTrigger}
            menuTracking={menuTracking}
            footerNavTracking={footerNavTracking}
            footerSocialTracking={footerSocialTracking}
        />
    );
};
