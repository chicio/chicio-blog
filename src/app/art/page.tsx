import { Art } from "@/components/sections/art/components/art";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    url: `${siteMetadata.siteUrl}${slugs.art}`,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function ArtPage() {
  return (
    <Art />
  );
}
