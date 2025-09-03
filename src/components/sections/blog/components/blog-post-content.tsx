import { BlogPostProgressBar } from "@/components/sections/blog/components/blog-post-progress-bar";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { BlogPageTemplate } from "@/components/sections/blog/components/blog-page-template";
import { Post } from "@/types/post";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { PostAuthors } from "./post-authors";
import { PostContent } from "./post-content";
import { PostMeta } from "./post-meta";
import { PostTags } from "./post-tags";
import { RecentPosts } from "./read-next";

interface PostProps {
  post: Post;
}

export const BlogPostContent: FC<PostProps> = ({ post }) => {
  const { frontmatter, content, readingTime } = post;

  return (
    <>
      <BlogPostProgressBar />
      <BlogPageTemplate
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_post}
      >
        <h1 className="leading-tight">{frontmatter.title}</h1>
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
