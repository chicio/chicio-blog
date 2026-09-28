import { ContentPage } from "@/components/features/content/content-page";
import { CoverCard } from "@/components/features/design-system-next/cover-card";
import { artGallery } from "@/lib/content/art/art";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ArtHeader } from "../art-header";

export const Art = () => {
    return (
        <ContentPage author={siteMetadata.author} trackingCategory={tracking.category.art}>
            <ArtHeader />
            <div className="my-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {artGallery().map((image) => (
                    <CoverCard key={image.src} src={image.src} title={image.caption} action={{ kind: "lightbox" }} />
                ))}
            </div>
        </ContentPage>
    );
};
