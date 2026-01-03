import { siteMetadata } from "@/types/site-metadata";
import { tracking } from "@/types/tracking";
import {getPostsForTag, getTags} from "@/lib/posts/posts";
import { NextTagParameters } from "@/types/page-parameters";
import {Metadata} from "next";
import {createMetadata} from "@/lib/seo/seo";
import { BlogGenericPostListPageTemplate } from "@/components/sections/blog/components/blog-generic-post-list-page-template";
import { generateTagSlug } from "@/lib/tags/tags";

export async function generateMetadata({ params }: NextTagParameters): Promise<Metadata> {
    const { tag } = await params

    return createMetadata({
        author: siteMetadata.author,
        title: siteMetadata.title,
        description: siteMetadata.description,
        slug: generateTagSlug(tag),
        imageUrl: siteMetadata.featuredImage,
        ogPageType: 'website',
    })
}

export async function generateStaticParams() {
    const tags = getTags();

    return tags.map((tag) => ({
        tag: tag.tagSlugText
    }));
}

export default async function TagPage({ params }: NextTagParameters) {
  const { tag } = await params;
  const parsedTag = tag.replaceAll("-", " ");
  const posts = getPostsForTag(parsedTag);
  const tagHeader = `${parsedTag} (${posts.length})`;

  return (
      <BlogGenericPostListPageTemplate
        title={tagHeader}
        posts={posts}
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_tag}
        keywords={[tag]}
      />
  );
}
