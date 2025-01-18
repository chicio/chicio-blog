import type { MetadataRoute } from "next";
import { getPosts, getPostsTotalPages, getTags } from "@/lib/posts";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const tags = getTags();
  const totalPages = getPostsTotalPages(posts);
  const blogPaginationPages: MetadataRoute.Sitemap = [];

  for (let i = 1; i <= totalPages; i++) {
    blogPaginationPages.push({
      url: `${siteMetadata.siteUrl}${slugs.blogPostsPage}/${i}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    });
  }

  return [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    {
      url: `${siteMetadata.siteUrl}${slugs.blog}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    ...blogPaginationPages,
    {
      url: `${siteMetadata.siteUrl}${slugs.blogArchive}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    ...posts.map((post) => ({
      url: `${siteMetadata.siteUrl}${post.frontmatter.slug}`,
      lastModified: new Date(post.frontmatter.date),
      priority: 1,
      images: [`${siteMetadata.siteUrl}${post.frontmatter.image}`],
    })),
    {
      url: `${siteMetadata.siteUrl}${slugs.tags}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    ...tags.map((tag) => ({
      url: `${siteMetadata.siteUrl}/${tag.slug}`,
      lastModified: new Date(),
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    })),
    {
      url: `${siteMetadata.siteUrl}${slugs.art}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredArtImage}`],
    },
  ];
}
