import "highlight.js/styles/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

import { BlogPostContent } from "@/components/sections/blog/components/blog-post-content";
import { getPostBy, getPosts } from "@/lib/content/posts";
import { createMetadata } from "@/lib/seo/seo";
import { NextPostParameters } from "@/types/next/page-parameters";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: NextPostParameters): Promise<Metadata> {
  const receivedParameters = await params;
  const post = getPostBy(receivedParameters)!;
  
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
  return getPosts().map((post) => post.slug.params);
}

export default async function BlogPostPage({ params }: NextPostParameters) {
  const receivedParameters = await params;
  const post = getPostBy(receivedParameters);

  if (!post) {
    notFound();
  }

  return (
    <BlogPostContent post={post} />
  );
}
