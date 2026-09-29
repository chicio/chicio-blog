import { PageTemplate } from "@/components/features/content/page-template";
import { BrandHeader } from "@/components/features/design-system-next/brand-header";
import { FC, PropsWithChildren, ReactNode } from "react";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import type {
    FooterLink,
    SocialContactLinks,
    FooterSocialTrackingCallbacks,
} from "@/components/features/design-system-next/footer";

export interface ContentPageProps {
    author: string;
    big?: boolean;
    headerWrapper?: FC<PropsWithChildren>;
    menuEntries: MenuEntry[];
    footerLinks: FooterLink[];
    contactHref: string;
    socialLinks: SocialContactLinks;
    onPaletteTrigger?: () => void;
    footerSocialTracking?: FooterSocialTrackingCallbacks;
    children?: ReactNode;
}

export const ContentPageTemplate: FC<ContentPageProps> = ({
    children,
    author,
    big = false,
    headerWrapper,
    menuEntries,
    footerLinks,
    contactHref,
    socialLinks,
    onPaletteTrigger,
    footerSocialTracking,
}) => (
    <PageTemplate
        author={author}
        menuEntries={menuEntries}
        footerLinks={footerLinks}
        contactHref={contactHref}
        socialLinks={socialLinks}
        onPaletteTrigger={onPaletteTrigger}
        footerSocialTracking={footerSocialTracking}
        header={<BrandHeader big={big} wrapper={headerWrapper} />}
    >
        {children}
    </PageTemplate>
);
