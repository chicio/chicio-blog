import { MediaGrid } from "./media-grid";
import { MatrixHeaderBackground } from "@/components/design-system/molecules/effects/matrix-header-background";
import { GenericHeader } from "@/components/design-system/organism/header/generic-header";
import { PageTemplate } from "@/components/design-system/templates/page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { ClownSvgIcon } from "./clown-svg-icon";
import { FC, PropsWithChildren } from "react";
import { menuNavHrefs, footerNavHrefs, socialContactLinks } from "@/components/features/content/nav-config";

export const ClownsPageTemplate: FC<PropsWithChildren> = ({ children }) => {
    return (
        <PageTemplate
            header={
                <>
                    <MatrixHeaderBackground big={false} />
                    <GenericHeader
                        title="Clownified!!!"
                        subtitle="Bravo! Keep up the effort and you'll clown-it!"
                        logo={<ClownSvgIcon />}
                    />
                </>
            }
            author={siteMetadata.author}
            navHrefs={menuNavHrefs}
            footerNavHrefs={footerNavHrefs}
            socialLinks={socialContactLinks}
        >
            <MediaGrid>
                {children}
            </MediaGrid>
        </PageTemplate>
    );
};
