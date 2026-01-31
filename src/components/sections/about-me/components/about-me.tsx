import AboutMeContent from "../../../../content/about-me/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { AboutMeTableOfContents } from "./about-me-table-of-contents";

export const AboutMe: React.FC = () => {
  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.about_me}
    >
      <AboutMeTableOfContents />
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
