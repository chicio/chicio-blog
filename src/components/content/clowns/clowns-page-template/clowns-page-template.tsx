import { MediaGrid } from "./media-grid";
import { ContentPage } from "@/components/features/content/content-page";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { ParagraphTitleWithIcon } from "@/components/design-system/molecules/typography/paragraph-title-with-icon";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ClownSvgIcon } from "./clown-svg-icon";
import { FC, PropsWithChildren } from "react";

export const ClownsPageTemplate: FC<PropsWithChildren> = ({ children }) => {
    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.clowns}>
            <PageTitle>
                <ParagraphTitleWithIcon icon={<ClownSvgIcon />}>Clownified!!!</ParagraphTitleWithIcon>
            </PageTitle>
            <MediaGrid>
                {children}
            </MediaGrid>
        </ContentPage>
    );
};
