import AboutMeContent from "../../../../content/about-me/content.mdx";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";

export const AboutMe: React.FC = () => {
  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.about_me}
    >
      <AboutMeContent />
      <JsonLd
        type="Person"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title}
      />
    </ReadingContentPageTemplate>
  );
};
