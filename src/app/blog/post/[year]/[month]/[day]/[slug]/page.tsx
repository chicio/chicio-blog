import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { BlogPostContent } from "@/components/sections/blog/components/blog-post-content";
import { getPostBy, getPosts } from "@/lib/content/posts";
import { createMetadata } from "@/lib/seo/seo";
import { NextPostParameters } from "@/types/page-parameters";
import { Post } from "@/types/content/post";
import { siteMetadata } from "@/types/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: NextPostParameters): Promise<Metadata> {
  const { year, month, day, slug } = await params;
  const post = getPostBy(year, month, day, slug)!;
  
  if (!post) {
    return {};
  }

  const { frontmatter } = post;

  return createMetadata({
    author: siteMetadata.author,
    title: frontmatter.title,
    slug: post.slug.formatted,
    imageUrl: frontmatter.image,
    description: frontmatter.description,
    ogPageType: "article",
    keywords: frontmatter.tags,
  });
}

export async function generateStaticParams() {
  const posts: Post[] = getPosts();

  return posts.map((post) => ({
    year: post.slug.year,
    month: post.slug.month,
    day: post.slug.day,
    slug: post.slug.text,
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
