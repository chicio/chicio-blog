import {SiteMetadataSocialLinks} from "@/types/site-metadata";
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
   url,
   imageUrl,
   ogPageType,
   keywords
}: {
    author: string,
    title: string,
    url: string,
    imageUrl: string,
    ogPageType: OgPageType,
    keywords?: string[]
}): Metadata => ({
    // Basic metadata
    title,
    description: title,
    authors: [{name: author}],
    keywords: keywords || defaultKeywords,

    // Open Graph
    openGraph: {
        title,
        description: title,
        url,
        siteName: author,
        images: [{url: imageUrl}],
        locale: 'en_US',
        type: ogPageType
    },

    alternates: {
        canonical: url
    },

    // Twitter
    twitter: {
        card: 'summary',
        title,
        images: [imageUrl],
        site: '@chicio86',
        creator: '@chicio86'
    },

    // Additional meta tags
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

export function createStructuredData({
   ogPageType,
   url,
   imageUrl,
   author,
   title,
   links,
   keywords,
   description,
   date
}: {
    ogPageType: OgPageType
    url: string
    imageUrl: string
    author: string
    title: string
    links: SiteMetadataSocialLinks
    keywords?: string[]
    description?: string
    date?: string
}) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': ogPageType,
        name: author,
        url,
        image: imageUrl,
        description: description || title,
        ...(date && {
            datePublished: date,
            dateModified: date
        }),
        ...(ogPageType === 'article' && {
            headline: title.length > 110 ? title.substring(0, 110) : title,
            mainEntityOfPage: {
                '@type': 'WebPage',
                '@id': url
            }
        }),
        ...(ogPageType !== 'profile' && {
            author: {
                '@type': 'Person',
                name: author
            },
            publisher: {
                '@type': 'Organization',
                name: author,
                logo: {
                    '@type': 'ImageObject',
                    url: imageUrl
                }
            }
        }),
        ...(links && {
            sameAs: [
                links.twitter,
                links.facebook,
                links.linkedin,
                links.github
            ].filter(Boolean)
        }),
        ...(ogPageType !== 'profile' && {
            keywords: keywords || defaultKeywords
        })
    }

    return jsonLd
}
