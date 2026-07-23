import { ContentPage } from "@/components/features/content/content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import ArtContent from "@/content/art/content.mdx";
import { ArtGalleryFigure } from "../art-gallery/art-gallery-figure";
import { ArtGalleryImage } from "../art-gallery/art-gallery-image";
import { ArtGalleryProvider } from "../art-gallery/art-gallery-provider";
import { ArtHeader } from "../art-header";

const artGalleryMdxComponents = { img: ArtGalleryImage, figure: ArtGalleryFigure };

export const Art = () => {
    return (
        <ContentPage
            author={siteMetadata.author}
            trackingCategory={tracking.category.art}
        >
            <ArtHeader />
            <ArtGalleryProvider>
                <ArtContent components={artGalleryMdxComponents} />
            </ArtGalleryProvider>
        </ContentPage>
    );
};
