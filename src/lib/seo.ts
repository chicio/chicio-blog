import {SiteMetadataSocialLinks} from "@/types/site-metadata";
import type {Metadata} from 'next'

export type OgPageType = 'website' | 'article' | 'profile'

export function createMetadata({
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
}): Metadata {
    const validKeywords: string[] = keywords || [
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
        "backend",
        "typescript",
        "kotlin",
        "java",
        "xcode",
        "swift",
        "swiftui",
    ];

    return {
        // Basic metadata
        title,
        description: title,
        authors: [{name: author}],
        keywords: validKeywords,

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
    }
}

export const createJsonLD = (
    ogPageType: OgPageType,
    url: string,
    imageUrl: string,
    author: string,
    title: string,
    links: SiteMetadataSocialLinks,
    keywords: ReadonlyArray<string | null>,
    description?: string,
    date?: string,
) => `{
        ${
    date
        ? `"datePublished":"${date}",
               "dateModified":"${date}", `
        : ""
}
        "@type":"${ogPageType}",
        "url":"${url}",
        "image":"${imageUrl}",
        ${
    ogPageType === 'article'
        ? `"mainEntityOfPage":{\n"@type":"WebPage",\n"@id":"${url}"\n},`
        : ""
}
        ${
    ogPageType !== 'profile'
        ? `"author":{
          "@type":"Person",
          "name":"${author}"
        },`
        : ""
}
        ${
    ogPageType !== 'profile'
        ? `"publisher":{
          "@type":"Organization",
          "logo":{
            "@type":"ImageObject",
            "url":"${imageUrl}"
          },
          "name":"${author}"
        },`
        : ""
}
        ${ogPageType === 'website' ? `"headline":"${author}",` : ""}
        ${
    ogPageType === 'article'
        ? `"headline":"${
            title.length > 110 ? title.substr(0, 110) : title
        }",`
        : ""
}
        "description":"${
    ogPageType === 'article' ? description : title
}",
        "sameAs":[
          "${links!.twitter}",
          "${links!.facebook}",
          "${links!.linkedin}",
          "${links!.github}"
        ],
        "name":"${author}",
        "@context":"https://schema.org",
        ${
    ogPageType !== 'profile'
        ? `"keywords": [
                ${keywords
            .filter((value) => value !== null)
            .map((keyword) => `"${keyword}"`)
            .join(",")}
                ]`
        : ""
}
      }`;
