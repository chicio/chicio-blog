import { createStructuredData, OgPageType } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { FC } from "react"

type JsonLdProps = {
    ogPageType: OgPageType,
    url: string;
    imageUrl: string;
    title: string;
}

export const JsonLd: FC<JsonLdProps> = ({ogPageType, url, imageUrl, title}) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(createStructuredData({
                ogPageType,
                url,
                imageUrl,
                author: siteMetadata.author,
                title,
                links: siteMetadata.contacts.links,
            }))
        }} />
)
