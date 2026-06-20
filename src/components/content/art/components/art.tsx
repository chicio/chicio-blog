import { ContentPage } from "@/components/features/content-page";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ArtGallery } from "./art-gallery";
import { ArtHeader } from "./art-header";

export const Art = () => {
  return (
    <ContentPage
      author={siteMetadata.author}
      trackingCategory={tracking.category.art}
    >
      <ArtHeader />
      <ArtGallery />
    </ContentPage>
  );
};
