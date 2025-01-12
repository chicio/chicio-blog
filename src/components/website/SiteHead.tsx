'use client'

import { FC } from "react";
import {createJsonLD, createMetaAttributes, OgPageType} from "@/lib/seo";
import {siteMetadata} from "@/types/site-metadata";
import Head from "next/head";
import {usePathname} from "next/navigation";

interface HeadProps {
  pageType: OgPageType;
  imageUrl: string;
  customTitle?: string;
  date?: string;
  description?: string;
  keywords?: string[];
}

export const SiteHead: FC<HeadProps> = ({
  pageType,
  imageUrl,
  customTitle,
  date,
  description,
  keywords,
}) => {
  const title = customTitle ? customTitle : siteMetadata.title;
  const author = siteMetadata.author;
  const siteUrl = siteMetadata.siteUrl;
  const links = siteMetadata.contacts.links;
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

  const pathname = usePathname()
  const url = `${siteUrl}${pathname}`

  const metaAttributes = createMetaAttributes(
      author,
      title,
      url,
      `${siteUrl}${imageUrl}`,
      pageType,
      validKeywords,
  );

  return (
      <Head>
        <title>{title}</title>
        <link rel="canonical" href={url}/>
        <link rel="author" href={"/humans.txt"}/>
        <link
            rel="preload"
            href="/fonts/opensans/OpenSans-Regular.woff2"
            as="font"
            crossOrigin="anonymous"
        />
        {metaAttributes.map((attr, index) => {
          const key = `${attr.name || attr.property}-${index}`;
          if (attr.name) {
            return <meta key={key} name={attr.name} content={attr.content} />;
          } else
          if (attr.property) {
            return <meta key={key} property={attr.property} content={attr.content} />;
          }
          return null;
        })}
        <script type="application/ld+json">
          {createJsonLD(
              pageType,
              url,
              imageUrl,
              author,
              title,
              links,
              validKeywords,
              description,
              date,
          )}
        </script>
      </Head>
  );
};
