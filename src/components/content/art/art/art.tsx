import { ContentPage } from "@/components/features/content/content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import ArtContent from "@/content/art/content.mdx";
import { ArtHeader } from "../art-header";

export const Art = () => {
    return (
        <ContentPage
            author={siteMetadata.author}
            trackingCategory={tracking.category.art}
        >
            <ArtHeader />
            <div className="art-gallery-grid">
                <ArtContent />
            </div>
        </ContentPage>
    );
};
