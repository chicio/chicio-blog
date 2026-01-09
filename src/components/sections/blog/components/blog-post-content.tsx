import { ReadingContentPageTemplate } from "@/components/design-system/templates/reading-content-page-template";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { Post } from "@/types/post";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { FC } from "react";
import { PostAuthors } from "./post-authors";
import { PostMeta } from "./post-meta";
import { PostTags } from "./post-tags";
import { RecentPosts } from "./read-next";

interface PostProps {
  post: Post;
}

export const BlogPostContent: FC<PostProps> = async ({ post }) => {
  const { frontmatter, readingTime, fileName } = post;
  const { default: PostContent } = await import(`@/content/posts/${fileName}.mdx`)

  return (
    <>
      <ReadingContentPageTemplate
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_post}
        beforeContent={
          <>
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
          </>
        }
        afterContent={
          <>
            <PostTags
              tags={frontmatter.tags}
              trackingCategory={tracking.category.blog_post}
              trackingLabel={tracking.label.body}
            />
            <RecentPosts currentSlug={frontmatter.slug.formatted} />
          </>
        }
      >
        <PostContent />
      </ReadingContentPageTemplate>
      <JsonLd
        type="BlogPosting"
        url={`${siteMetadata.siteUrl}${frontmatter.slug.formatted}`}
        imageUrl={frontmatter.image}
        title={frontmatter.title}
        date={frontmatter.date}
        description={frontmatter.description}
        keywords={frontmatter.tags}
      />
    </>
  );
};
