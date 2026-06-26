"use client";

import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import type { ContentPageProps as DesignSystemContentPageProps } from "@/components/design-system/templates/content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";
import { useContentPageStore } from "./use-content-page-store";

export type ContentPageProps = Omit<
    DesignSystemContentPageProps,
    "onPaletteTrigger" | "onTrackNavigation" | "onTrackSocial"
> & {
    trackingCategory: string;
};

export const ContentPage: FC<ContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { effects } = useContentPageStore(trackingCategory);
    const { onPaletteTrigger, onTrackNavigation, onTrackSocial } = effects;

    return (
        <ContentPageTemplate
            {...rest}
            headerWrapper={DejavuEasterEgg}
            onPaletteTrigger={onPaletteTrigger}
            onTrackNavigation={onTrackNavigation}
            onTrackSocial={onTrackSocial}
        />
    );
};
