import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";

interface DsaProps {
  roadmap: Content
}

export const Roadmap: FC<PropsWithChildren<DsaProps>> = async ({ roadmap }) => {
  const { default: RoadmapContent } = await import(`@/content/data-structures-and-algorithms/roadmap/content.mdx`)

  return <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.data_structures_and_algorithms}
  >
    <RoadmapContent />
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${roadmap.slug.formatted}`}
      imageUrl={siteMetadata.featuredImage}
      title={roadmap.frontmatter.title}
      description={siteMetadata.description}
      keywords={roadmap.frontmatter.tags}
    />
  </ReadingContentPageTemplate>
};
