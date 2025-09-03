import { StandardInternalLinkWithTracking } from "@/components/design-system/atoms/links/standard-internal-link-with-tracking";
import { PageTitle } from "@/components/design-system/molecules/typography/page-title";
import { Post } from "@/types/post";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { BlogPageTemplate } from "./blog-page-template";

export interface BlogGenericPostListPageProps {
  title: string;
  posts: Post[];
  author: string;
  trackingCategory: string;
}

export const BlogGenericPostListPageTemplate: FC<
  BlogGenericPostListPageProps
> = ({ title, posts, author, trackingCategory }) => (
  <BlogPageTemplate author={author} trackingCategory={trackingCategory}>
    <PageTitle>{title}</PageTitle>
    {posts.map((post) => (
      <div
        className="container-fluid flex flex-col items-start mb-4 px-0 md:flex-row md:items-center"
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
  </BlogPageTemplate>
);
