import { siteMetadata } from "@/types/configuration/site-metadata";
import { tracking } from "@/types/configuration/tracking";
import { posts } from "@/lib/content/posts/posts";
import { BlogGenericPostListPageTemplate } from "@/components/content/blog/blog-generic-post-list-page-template";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";
import { createMetadata } from "@/lib/seo/seo";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    description: siteMetadata.description,
    slug: slugs.blog.blogArchive,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function BlogArchivePage() {
  const author = siteMetadata.author;
  const allPosts = posts.list();

  return (
    <BlogGenericPostListPageTemplate
      title={"Archive"}
      posts={allPosts}
      author={author}
      trackingCategory={tracking.category.blog_archive}
    />
  );
}
