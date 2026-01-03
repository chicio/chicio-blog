import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { Post } from "@/types/post";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { ContentPageTemplate } from "../../../design-system/templates/content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { siteMetadata } from "@/types/site-metadata";

export interface BlogGenericPostListPageProps {
  title: string;
  posts: Post[];
  author: string;
  trackingCategory: string;
  keywords?: string[];
}

export const BlogGenericPostListPageTemplate: FC<
  BlogGenericPostListPageProps
> = ({ title, posts, author, trackingCategory, keywords }) => (
  <ContentPageTemplate author={author} trackingCategory={trackingCategory}>
    <PageTitle>{title}</PageTitle>
    {posts.map((post) => (
      <div
        className="container-fluid mb-4 flex flex-col items-start px-0 md:flex-row md:items-center"
        key={post.frontmatter.slug.formatted}
      >
        <div className="flex-1/6">
          <time className="text-xl">{post.frontmatter.date.formatted}</time>
        </div>
        <div className="flex-5/6">
          <StandardInternalLinkWithTracking
            className="text-xl"
            to={post.frontmatter.slug.formatted}
            trackingData={{
              action: tracking.action.open_blog_post,
              category: trackingCategory,
              label: tracking.label.body,
            }}
          >
            {post.frontmatter.title}
          </StandardInternalLinkWithTracking>
        </div>
      </div>
    ))}
    <JsonLd
      type="Blog"
      url={siteMetadata.siteUrl}
      imageUrl={siteMetadata.featuredImage}
      title={siteMetadata.title}
      keywords={keywords}
    />
  </ContentPageTemplate>
);
