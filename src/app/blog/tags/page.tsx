import { BlogTags } from "@/components/sections/blog/components/blog-tags";
import { getTags } from "@/lib/content/posts";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    description: siteMetadata.description,
    slug: slugs.blog.tags,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function Tags() {
  const tags = getTags();
  const author = siteMetadata.author;

  return (
    <BlogTags author={author} tags={tags} />
  );
}
