import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import Arrays from "../../../content/dsa/arrays.mdx";

export default function ArraysPage() {
  return (
    <ReadingContentPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.dsa}
    >
      <Arrays />
    </ReadingContentPageTemplate>
  );
}
