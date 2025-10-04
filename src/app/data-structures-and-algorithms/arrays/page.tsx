import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { BlogPageTemplate } from "@/components/sections/blog/components/blog-page-template";
import Arrays from "../../../content/dsa/arrays.mdx";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";

export default function array() {
  return (
    <BlogPageTemplate
      author={siteMetadata.author}
      trackingCategory={tracking.category.art}
    >
      <div id="blog-post-container">
        <Arrays />
      </div>
    </BlogPageTemplate>
  );
}
