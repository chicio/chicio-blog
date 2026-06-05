import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Content } from "@/types/content/content";

interface ExercisesProps {
  exercises: Content;
}

export const Exercises: FC<PropsWithChildren<ExercisesProps>> = async ({ exercises }) => {
  const { default: ExercisesContent } = await import(`@/content/data-structures-and-algorithms/exercises/content.mdx`);

  return <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.data_structures_and_algorithms}
  >
    <ExercisesContent />
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${exercises.slug.formatted}`}
      imageUrl={siteMetadata.featuredImage}
      title={exercises.frontmatter.title}
      description={siteMetadata.description}
      keywords={exercises.frontmatter.tags}
    />
  </ReadingContentPageTemplate>
};
