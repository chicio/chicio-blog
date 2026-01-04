import { authors } from "@/types/author";
import { PostDate } from "@/types/post";
import { siteMetadata, SiteMetadataSocialLinks} from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import type {Metadata} from 'next'

export type OgPageType = 'website' | 'article' | 'profile'

const defaultKeywords = [
    "fabrizio duroni",
    "chicio",
    "chicio86",
    "mobile development",
    "iOS",
    "apple",
    "android",
    "react",
    "react native",
    "frontend",
    "nextjs",
    "expo",
    "typescript",
    "kotlin",
    "java",
    "xcode",
    "swift",
    "swiftui",
    "backend",
]

export const createMetadata = ({
   author,
   title,
   slug: url,
   imageUrl,
   ogPageType,
   description,
   keywords
}: {
    author: string,
    title: string,
    slug: string,
    imageUrl: string,
    ogPageType: OgPageType,
    description?: string,
    keywords?: string[]
}): Metadata => ({
    metadataBase: new URL(siteMetadata.siteUrl),
    title,
    description: description || title,
    authors: [{name: author}],
    keywords: keywords || defaultKeywords,
    openGraph: {
        title,
        description: description || title,
        url,
        siteName: author,
        images: [{url: imageUrl}],
        locale: 'en_US',
        type: ogPageType
    },
    alternates: {
        canonical: url
    },
    twitter: {
        card: 'summary',
        title,
        images: [imageUrl],
        site: '@chicio86',
        creator: '@chicio86'
    },
    other: {
        'p:domain_verify': '33d2d5dad0e1496d9f7974925340ea50',
        'apple-mobile-web-app-status-bar-style': 'black',
        'msapplication-config': 'browserconfig.xml',
        'msapplication-TileColor': '#303f9f',
        'msapplication-TileImage': '/mstile-144x144.png',
        'yandex-verification': '741cf901cb1dbdf5',
        'article:publisher': 'https://www.facebook.com/fabrizio.duroni',
        'fb:app_id': '443203349348229'
    }
});

export type WebsiteJsonLd = 'Website'
export type PersonJsonLd = 'Person'
export type BlogJsonLd = 'Blog'
export type BlogPostingJsonLd = 'BlogPosting'
export type JsonLdType = WebsiteJsonLd | PersonJsonLd | BlogPostingJsonLd | BlogJsonLd 

const jsonLdIds: Partial<Record<JsonLdType, string>> = {
    'Person': `${siteMetadata.siteUrl}/#person`,
    'Website': `${siteMetadata.siteUrl}/#website`,
    'Blog': `${siteMetadata.siteUrl}/#blog`,
};

const formattedDate = (date: PostDate): string => 
    `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}T00:00:00+00:00`;

export function createStructuredData({
   type,
   url,
   imageUrl,
   author,
   title,
   links,
   keywords,
   description,
   date
}: {
    type: JsonLdType
    url: string
    imageUrl: string
    author: string
    title: string
    links: SiteMetadataSocialLinks
    keywords?: string[]
    description?: string
    date?: PostDate
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': type,
        '@id': jsonLdIds[type] ?? url,
        name: author,
        url,
        image: `${siteMetadata.siteUrl}${imageUrl}`,
        description: description || title,
        ...(type === 'BlogPosting' && date && {
            datePublished: formattedDate(date),
            dateModified: formattedDate(date)
        }),
        ...(type === 'BlogPosting' && {
            headline: title.length > 110 ? title.substring(0, 110) : title,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url
            }
        }),
        ...(type !== 'Person' && {
            author: {
                "@id":  jsonLdIds['Person'],
                '@type': 'Person',
                name: author,
                image: authors.fabrizio_duroni.image,
                url: `${siteMetadata.siteUrl}${slugs.aboutMe}`
            },
            publisher: {
                "@id":  jsonLdIds['Person'],
                '@type': 'Person',
                name: author,
                image: authors.fabrizio_duroni.image,
                url: `${siteMetadata.siteUrl}${slugs.aboutMe}`
            }
        }),
        ...(type === 'Person' && links && {
            sameAs: [
                links.twitter,
                links.facebook,
                links.linkedin,
                links.github,
                links.medium,
                links.devto,
                links.instagram
            ]
        }),
        ...(type !== 'Person' && {
            keywords: keywords || defaultKeywords
        })
    }

    return jsonLd
}
