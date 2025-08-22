import { BlogTags } from "@/components/sections/blog/components/blog-tags";
import { getTags } from "@/lib/posts/posts";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.tags}`,
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
