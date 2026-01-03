import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC, PropsWithChildren } from "react";
import { CourseNavigation } from "./course-navigation";

interface DsaProps {
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
      </ReadingContentPageTemplate>
    </>
  );
};
