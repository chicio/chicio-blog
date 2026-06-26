import { createStructuredData, JsonLdType } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { PublishDate } from "@/types/content/frontmatter";
import { FC } from "react"

type JsonLdProps = {
    type: JsonLdType;
    url: string;
    imageUrl: string;
    title: string;
    keywords?: string[];
    description?: string;
    date?: PublishDate;
}

export const JsonLd: FC<JsonLdProps> = ({type, url, imageUrl, title, date, description, keywords}) => (
    <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
            __html: JSON.stringify(createStructuredData({
                type,
                url,
                imageUrl,
                author: siteMetadata.author,
                title,
                links: siteMetadata.contacts.links,
                date,
                description,
                keywords
            }))
        }} />
)
