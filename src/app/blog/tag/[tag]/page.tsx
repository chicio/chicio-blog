import { siteMetadata } from "@/types/site-metadata";
import { BlogGenericPostListPageTemplate } from "@/components/templates/blog-generic-post-list-page-template";
import { tracking } from "@/types/tracking";
import {getPostsForTag, getTags} from "@/lib/posts/posts";
import { NextTagParameters } from "@/types/page-parameters";
import { JsonLd } from "@/components/design-system/website/jsond-ld";
import {Metadata} from "next";
import {createMetadata} from "@/lib/seo/seo";
import {slugs} from "@/types/slug";

export async function generateMetadata({ params }: NextTagParameters): Promise<Metadata> {
    const { tag } = await params

    return createMetadata({
        author: siteMetadata.author,
        title: siteMetadata.title,
        url: `${siteMetadata.siteUrl}${slugs.tag}/${tag}`,
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
    <>
      <BlogGenericPostListPageTemplate
        title={tagHeader}
        posts={posts}
        author={siteMetadata.author}
        trackingCategory={tracking.category.blog_tag}
      />
      <JsonLd
        ogPageType="website"
        url={siteMetadata.siteUrl}
        imageUrl={siteMetadata.featuredImage}
        title={siteMetadata.title + " | " + parsedTag}
      />
    </>
  );
}
