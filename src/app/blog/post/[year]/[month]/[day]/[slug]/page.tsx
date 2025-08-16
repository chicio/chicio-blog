import "katex/dist/katex.min.css";
import { getPostBy, getPosts } from "@/lib/posts/posts";
import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import { BlogPageTemplate } from "@/components/templates/blog-page-template";
import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/seo";
import {
  PostContainer,
  PostContent,
  PostTitle,
} from "@/components/design-system/website/post";
import { PostAuthors } from "@/components/design-system/molecules/post-authors";
import { PostMeta } from "@/components/design-system/molecules/post-meta";
import { PostTags } from "@/components/design-system/molecules/post-tags";
import { RecentPosts } from "@/components/design-system/organism/read-next";
import { NextPostParameters } from "@/types/page-parameters";
import { JsonLd } from "@/components/design-system/website/jsond-ld";
import { Post } from "@/types/post";

export const revalidate = false

export async function generateMetadata({
  params,
}: NextPostParameters): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const { frontmatter } = getPostBy(year, month, day, slug);

  return createMetadata({
    author: siteMetadata.author,
    title: frontmatter.title,
    url: `${siteMetadata.siteUrl}${frontmatter.slug.formatted}`,
    imageUrl: frontmatter.image,
    description: frontmatter.description,
    ogPageType: "article",
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  const posts: Post[] = getPosts();

  return posts.map((post) => ({
    year: post.frontmatter.slug.year,
    month: post.frontmatter.slug.month,
    day: post.frontmatter.slug.day,
    slug: post.frontmatter.slug.text,
  }));
}

export default async function BlogPost({ params }: NextPostParameters) {
  const { year, month, day, slug } = await params;
  const { frontmatter, content, readingTime } = getPostBy(
    year,
    month,
    day,
    slug,
  );

  return (
    <>
      <BlogPageTemplate
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_post}
      >
        <PostContainer>
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
        </PostContainer>
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
}
