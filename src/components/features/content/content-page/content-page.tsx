"use client";

import { ContentPageTemplate } from "@/components/design-system/templates/content-page-template";
import type { ContentPageProps as DesignSystemContentPageProps } from "@/components/design-system/templates/content-page-template";
import { DejavuEasterEgg } from "@/components/features/easter-eggs/dejavu";
import { FC } from "react";
import { useContentPageStore } from "./use-content-page-store";
import { menuNavHrefs, footerNavHrefs, socialContactLinks } from "../nav-config";

export type ContentPageProps = Omit<
    DesignSystemContentPageProps,
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
