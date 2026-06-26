"use client";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import type { ReadingContentPageProps as DesignSystemReadingContentPageProps } from "@/components/design-system/templates/reading-content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";
import { useReadingContentPageStore } from "./use-reading-content-page-store";
import { menuNavHrefs, footerNavHrefs, socialContactLinks } from "../nav-config";

export type ReadingContentPageProps = Omit<
    DesignSystemReadingContentPageProps,
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
            headerWrapper={DejavuEasterEgg}
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
