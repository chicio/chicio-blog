import type { MetadataRoute } from "next";
import { getPosts, getPostsTotalPages, getTags } from "@/lib/posts/posts";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts();
  const tags = getTags();
  const totalPages = getPostsTotalPages(posts);
  const blogPaginationPages: MetadataRoute.Sitemap = [];
  const defaultImage = [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`];

  for (let i = 1; i <= totalPages; i++) {
    blogPaginationPages.push({
      url: `${siteMetadata.siteUrl}${slugs.blog.blogPostsPage}/${i}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    });
  }

  return [
    {
      url: siteMetadata.siteUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    },
    {
      url: `${siteMetadata.siteUrl}${slugs.blog.home}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    },
    ...blogPaginationPages,
    {
      url: `${siteMetadata.siteUrl}${slugs.blog.blogArchive}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    ...posts.map((post) => ({
      url: `${siteMetadata.siteUrl}${post.frontmatter.slug.formatted}`,
      lastModified: new Date(post.frontmatter.date.formatted),
      priority: 1,
      images: [`${siteMetadata.siteUrl}${post.frontmatter.image}`],
    })),
    {
      url: `${siteMetadata.siteUrl}${slugs.blog.tags}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    },
    ...tags.map((tag) => ({
      url: `${siteMetadata.siteUrl}${tag.slug}`,
      lastModified: new Date(),
      priority: 1,
      images: defaultImage,
    })),
    {
      url: `${siteMetadata.siteUrl}${slugs.art}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredArtImage}`],
    },
    ...Object.values(slugs.dsa).map((key) => ({
      url: `${siteMetadata.siteUrl}${key}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    }))
  ];
}
