import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
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
  previousTopic,
  nextTopic,
  children,
}) => {
  return (
    <>
      <ReadingContentPageTemplate
        author={siteMetadata.author}
        trackingCategory={tracking.category.dsa}
      >
        {children}
        {(previousTopic || nextTopic) && (
          <CourseNavigation
            previousTopic={previousTopic}
            nextTopic={nextTopic}
          />
        )}
        <JsonLd
          type="TechArticle"
          url={`${siteMetadata.siteUrl}${slug}`}
          imageUrl={siteMetadata.featuredImage}
          title={siteMetadata.title}
          description={siteMetadata.description}
          keywords={[...keywords, "data structures", "algorithms"]}
        />
      </ReadingContentPageTemplate>
    </>
  );
};
