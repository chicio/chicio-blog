"use client";

import { ContentPageTemplate } from "@/components/features/content/content-page-template";
import type { ContentPageProps as ContentPageTemplateProps } from "@/components/features/content/content-page-template";
import { TheChoiceEasterEgg } from "@/components/features/easter-eggs/the-choice";
import { FC } from "react";
import { useContentPageStore } from "./use-content-page-store";
import { menuNavHrefs, footerNavHrefs, socialContactLinks } from "../nav-config";

export type ContentPageProps = Omit<
    ContentPageTemplateProps,
    | "navHrefs"
    | "footerNavHrefs"
    | "socialLinks"
    | "onPaletteTrigger"
    | "menuTracking"
    | "footerNavTracking"
    | "footerSocialTracking"
> & {
    trackingCategory: string;
};

export const ContentPage: FC<ContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { effects } = useContentPageStore(trackingCategory);
    const { onPaletteTrigger, menuTracking, footerNavTracking, footerSocialTracking } = effects;

    return (
        <ContentPageTemplate
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
