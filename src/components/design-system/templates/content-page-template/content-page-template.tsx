import { PageTemplate } from "@/components/design-system/templates/page-template";
import { BrandHeader } from "@/components/design-system/organism/header/brand-header";
import { FC, PropsWithChildren, ReactNode } from "react";
import type { MenuNavHrefs, MenuTrackingCallbacks } from "@/components/design-system/organism/menu";
import type {
    FooterNavHrefs,
    SocialContactLinks,
    FooterNavTrackingCallbacks,
    FooterSocialTrackingCallbacks,
} from "@/components/design-system/organism/footer";

export interface ContentPageProps {
    author: string;
    big?: boolean;
    headerWrapper?: FC<PropsWithChildren>;
    navHrefs: MenuNavHrefs;
    footerNavHrefs: FooterNavHrefs;
    socialLinks: SocialContactLinks;
    onPaletteTrigger?: () => void;
    menuTracking?: MenuTrackingCallbacks;
    footerNavTracking?: FooterNavTrackingCallbacks;
    footerSocialTracking?: FooterSocialTrackingCallbacks;
    children?: ReactNode;
}

export const ContentPageTemplate: FC<ContentPageProps> = ({
    children,
    author,
    big = false,
    headerWrapper,
    navHrefs,
    footerNavHrefs,
    socialLinks,
    onPaletteTrigger,
    menuTracking,
    footerNavTracking,
    footerSocialTracking,
}) => (
    <PageTemplate
        author={author}
        navHrefs={navHrefs}
        footerNavHrefs={footerNavHrefs}
        socialLinks={socialLinks}
        onPaletteTrigger={onPaletteTrigger}
        menuTracking={menuTracking}
        footerNavTracking={footerNavTracking}
        footerSocialTracking={footerSocialTracking}
        header={<BrandHeader big={big} wrapper={headerWrapper} />}
    >
        {children}
    </PageTemplate>
);
