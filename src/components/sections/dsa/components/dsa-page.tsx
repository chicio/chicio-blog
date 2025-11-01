import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC, PropsWithChildren } from "react";

export const DsaPage: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.dsa}
    >
      {children}
    </ReadingContentPageTemplate>
  );
};
