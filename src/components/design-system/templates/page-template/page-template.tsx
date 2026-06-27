import { ContentContainer } from "@/components/design-system/molecules/containers/content-container";
import { Footer } from "@/components/design-system/organism/footer";
import { Menu } from "@/components/design-system/organism/menu";
import { FC, ReactNode } from "react";
import type { MenuNavHrefs, MenuTrackingCallbacks } from "@/components/design-system/organism/menu";
import type {
    FooterNavHrefs,
    SocialContactLinks,
    FooterNavTrackingCallbacks,
    FooterSocialTrackingCallbacks,
} from "@/components/design-system/organism/footer";

export interface BlogPageProps {
    header: React.ReactElement;
    author: string;
    navHrefs: MenuNavHrefs;
    footerNavHrefs: FooterNavHrefs;
    socialLinks: SocialContactLinks;
    onPaletteTrigger?: () => void;
    menuTracking?: MenuTrackingCallbacks;
    footerNavTracking?: FooterNavTrackingCallbacks;
    footerSocialTracking?: FooterSocialTrackingCallbacks;
    children?: ReactNode;
}

export const PageTemplate: FC<BlogPageProps> = ({
    header,
    children,
    author,
    navHrefs,
    footerNavHrefs,
    socialLinks,
    onPaletteTrigger,
    menuTracking,
    footerNavTracking,
    footerSocialTracking,
}) => (
    <>
        <Menu navHrefs={navHrefs} onPaletteTrigger={onPaletteTrigger} tracking={menuTracking} />
        <ContentContainer>
            {header}
            <div className="mt-4">{children}</div>
        </ContentContainer>
        <Footer
            author={author}
            navHrefs={footerNavHrefs}
            socialLinks={socialLinks}
            navTracking={footerNavTracking}
            socialTracking={footerSocialTracking}
        />
    </>
);
