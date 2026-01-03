import { siteMetadata } from '@/types/site-metadata'
import type { MetadataRoute } from 'next'
import { slugs } from "@/types/slug";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: slugs.chat,
    },
    sitemap: `${siteMetadata.siteUrl}/sitemap.xml`,
  }
}