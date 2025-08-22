import { BlogHomePageContent } from "@/components/sections/blog/components/blog-homepage-content";
import {
  getPosts,
  getPostsPaginationFor,
  getPostsTotalPages,
} from "@/lib/posts/posts";
import { createMetadata } from "@/lib/seo/seo";
import { NextPostPaginationParameters } from "@/types/page-parameters";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: NextPostPaginationParameters): Promise<Metadata> {
  const { page } = await params;

  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.blogPostsPage}/${page}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export async function generateStaticParams() {
  const posts = getPosts();
  const totalPages = getPostsTotalPages(posts);
  const pageParams = [];

  for (let page = 2; page <= totalPages; page++) {
    pageParams.push({ page: `${page}` });
  }

  return pageParams;
}

export default async function BlogHomePage({
  params,
}: NextPostPaginationParameters) {
  const { page } = await params;
  const pageParam = parseInt(page || "1", 10);
  const pagination = getPostsPaginationFor(pageParam);

  if (!pagination) {
    notFound();
  }

  return (
    <BlogHomePageContent pagination={pagination} author={siteMetadata.author} />
  );
}
