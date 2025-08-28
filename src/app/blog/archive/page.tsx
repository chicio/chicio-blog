import {siteMetadata} from "@/types/site-metadata";
import {tracking} from "@/types/tracking";
import {getPosts} from "@/lib/posts/posts";
import { JsonLd } from "@/components/design-system/utils/components/jsond-ld";
import { BlogGenericPostListPageTemplate } from "@/components/sections/blog/components/blog-generic-post-list-page-template";
import { slugs } from "@/types/slug";
import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/seo";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.blogArchive}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function BlogArchivePage() {
  const author = siteMetadata.author;
  const posts = getPosts();

  return (
      <>
      <BlogGenericPostListPageTemplate
          title={"Archive"}
          posts={posts}
          author={author}
          trackingCategory={tracking.category.blog_archive}
      />
      <JsonLd ogPageType="website" url={siteMetadata.siteUrl} imageUrl={siteMetadata.featuredImage} title={siteMetadata.title}/>
      </>
  );
}

