import { BlogPageTemplate } from "@/components/sections/blog/components/blog-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { PostAuthors } from "./post-authors";
import { PostTitle, PostContent } from "./post-content";
import { PostMeta } from "./post-meta";
import { PostTags } from "./post-tags";
import { RecentPosts } from "./read-next";
import { Post } from "@/types/post";

interface PostProps {
  post: Post;
}

export const BlogPostContent: FC<PostProps> = ({ post }) => {
  const { frontmatter, content, readingTime } = post;

  return (
    <>
      <BlogPageTemplate
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_post}
      >
        <PostTitle className="blog-post-title">{frontmatter.title}</PostTitle>
        <PostAuthors
          postAuthors={frontmatter.authors}
          trackingCategory={tracking.category.blog_post}
          trackingLabel={tracking.label.body}
          enableUrl={true}
        />
        <PostMeta
          date={frontmatter.date.formatted}
          readingTime={readingTime.text}
        />
        <PostContent html={content} />
        <PostTags
          tags={frontmatter.tags}
          trackingCategory={tracking.category.blog_post}
          trackingLabel={tracking.label.body}
        />
        <RecentPosts currentSlug={frontmatter.slug.formatted} />
      </BlogPageTemplate>
      <JsonLd
        ogPageType="article"
        url={`${siteMetadata.siteUrl}${frontmatter.slug.formatted}`}
        imageUrl={frontmatter.image}
        title={frontmatter.title}
      />
    </>
  );
};
