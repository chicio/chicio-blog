import VideogamesTimelineContent from "../../../../content/videogames/timeline/content.mdx";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { getAllConsoles } from "@/lib/content/videogames";
import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";

export const VideogamesTimeline: React.FC = () => (
  <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.videogames}
  >
    <VideogamesTimelineContent />
    {getAllConsoles().map((console) => (
      <StandardInternalLinkWithTracking
        key={console.slug.formatted}
        to={console.slug.formatted}
        trackingData={{
          category: tracking.category.videogames,
          label: tracking.label.body,
          action: tracking.action.open_videogame_console,
        }}
      >{console.frontmatter.title}</StandardInternalLinkWithTracking>
    ))}
    <JsonLd
      type="Website"
      url={siteMetadata.siteUrl}
      imageUrl={siteMetadata.featuredImage}
      title={siteMetadata.title}
    />
  </ReadingContentPageTemplate>
);
