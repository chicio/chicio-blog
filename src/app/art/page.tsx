import { Art } from "@/components/sections/art/components/art";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    description: siteMetadata.description,
    slug: slugs.art,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "website",
  });
}

export default async function ArtPage() {
  return (
    <Art />
  );
}
