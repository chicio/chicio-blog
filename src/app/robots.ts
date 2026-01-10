import { siteMetadata } from '@/types/configuration/site-metadata'
import type { MetadataRoute } from 'next'
import { slugs } from "@/types/configuration/slug";

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