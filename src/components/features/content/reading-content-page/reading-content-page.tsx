"use client";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import type { ReadingContentPageProps as DesignSystemReadingContentPageProps } from "@/components/design-system/templates/reading-content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";
import { useReadingContentPageStore } from "./use-reading-content-page-store";

export type ReadingContentPageProps = Omit<
    DesignSystemReadingContentPageProps,
    "onPaletteTrigger" | "onTrackNavigation" | "onTrackSocial"
> & {
    trackingCategory?: string;
};

export const ReadingContentPage: FC<ReadingContentPageProps> = ({ trackingCategory, ...rest }) => {
    const { effects } = useReadingContentPageStore(trackingCategory);
    const { onPaletteTrigger, onTrackNavigation, onTrackSocial } = effects;

    return (
        <ReadingContentPageTemplate
            {...rest}
            headerWrapper={DejavuEasterEgg}
            onPaletteTrigger={onPaletteTrigger}
            onTrackNavigation={onTrackNavigation}
            onTrackSocial={onTrackSocial}
        />
    );
};
