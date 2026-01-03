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

export const BlogPostContent: FC<PostProps> = ({ post }) => {
  const { frontmatter, content, readingTime } = post;

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
        <div dangerouslySetInnerHTML={{ __html: content }} />
      </ReadingContentPageTemplate>
      <JsonLd
        type="BlogPosting"
        url={`${siteMetadata.siteUrl}${frontmatter.slug.formatted}`}
        imageUrl={frontmatter.image}
        title={frontmatter.title}
        date={frontmatter.date.formatted}
        description={frontmatter.description}
        keywords={frontmatter.tags}
      />
    </>
  );
};
