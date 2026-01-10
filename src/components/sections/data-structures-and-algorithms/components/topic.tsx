import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { CourseNavigation } from "./course-navigation";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";

interface DsaProps {
  topic: Content
  previousTopic?: Content;
  nextTopic?: Content;
}

export const Topic: FC<PropsWithChildren<DsaProps>> = async ({
  topic,
  previousTopic,
  nextTopic
}) => {
  const { contentPath } = topic;
  const { default: TopicContent } = await import(`@/content/${contentPath}/content.mdx`)
  
  return <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.data_structures_and_algorithms}
  >
    <TopicContent />
    {(previousTopic || nextTopic) && (
      <CourseNavigation previousTopic={previousTopic} nextTopic={nextTopic} />
    )}
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${topic.slug.formatted}`}
      imageUrl={siteMetadata.featuredImage}
      title={topic.frontmatter.title}
      description={siteMetadata.description}
      keywords={topic.frontmatter.tags}
    />
  </ReadingContentPageTemplate>
};
