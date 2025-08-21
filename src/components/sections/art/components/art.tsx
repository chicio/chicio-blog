import { BlogPageTemplate } from "@/components/design-system/templates/blog-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { ArtGallery } from "./art-gallery";
import { ArtHeader } from "./art-header";

export const Art = () => {
  return (
    <BlogPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.art}
    >
      <ArtHeader />
      <ArtGallery />
    </BlogPageTemplate>
  );
};
