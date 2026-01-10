import type { MetadataRoute } from "next";
import { getPostsTotalPages, getTags } from "@/lib/content/posts";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { getIndexableContent } from "@/lib/content/indexable-content";

const getPostListPages = (defaultImage: string[]) => {
  const totalPages = getPostsTotalPages();
  const blogPaginationPages: MetadataRoute.Sitemap = [];

  for (let i = 1; i <= totalPages; i++) {
    blogPaginationPages.push({
      url: `${siteMetadata.siteUrl}${slugs.blog.blogPostsPage}/${i}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    });
  }

  return blogPaginationPages;
};

export default function sitemap(): MetadataRoute.Sitemap {
  const defaultImage = [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`];

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
    ...getPostListPages(defaultImage),
    {
      url: `${siteMetadata.siteUrl}${slugs.blog.blogArchive}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: [`${siteMetadata.siteUrl}${siteMetadata.featuredImage}`],
    },
    {
      url: `${siteMetadata.siteUrl}${slugs.blog.tags}`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
      images: defaultImage,
    },
    ...getTags().map((tag) => ({
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
    ...getIndexableContent().map((content) => ({
      url: `${siteMetadata.siteUrl}${content.slug.formatted}`,
      lastModified: new Date(content.frontmatter.date.formatted),
      priority: 1,
      images: [`${siteMetadata.siteUrl}${content.frontmatter.image}`],
    })),
  ];
}
