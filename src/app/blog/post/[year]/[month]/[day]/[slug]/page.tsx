import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { BlogPostContent } from "@/components/sections/blog/components/blog-post-content";
import { getPostBy, getPosts } from "@/lib/posts/posts";
import { createMetadata } from "@/lib/seo/seo";
import { NextPostParameters } from "@/types/page-parameters";
import { Post } from "@/types/post";
import { siteMetadata } from "@/types/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = false

export async function generateMetadata({
  params,
}: NextPostParameters): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const { frontmatter } = getPostBy(year, month, day, slug)!;

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
  const post = getPostBy(
    year,
    month,
    day,
    slug,
  );

  if (!post) {
    notFound();
  }

  return (
    <BlogPostContent post={post} />
  );
}
