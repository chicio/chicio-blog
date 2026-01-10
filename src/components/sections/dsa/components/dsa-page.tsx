import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { FC, PropsWithChildren } from "react";
import { CourseNavigation } from "./course-navigation";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";

interface DsaProps {
  slug: string;
  keywords: string[];
  description: string;
  previousTopic?: {
    url: string;
    title: string;
  };
  nextTopic?: {
    url: string;
    title: string;
  };
}

export const DsaPage: FC<PropsWithChildren<DsaProps>> = ({
  slug,
  keywords,
  description,
  previousTopic,
  nextTopic,
  children,
}) => (
  <ReadingContentPageTemplate
    author={siteMetadata.author}
    trackingCategory={tracking.category.dsa}
  >
    {children}
    {(previousTopic || nextTopic) && (
      <CourseNavigation previousTopic={previousTopic} nextTopic={nextTopic} />
    )}
    <JsonLd
      type="BlogPosting"
      url={`${siteMetadata.siteUrl}${slug}`}
      imageUrl={siteMetadata.featuredImage}
      title={description}
      description={siteMetadata.description}
      keywords={[...keywords, "data structures", "algorithms"]}
    />
  </ReadingContentPageTemplate>
);
