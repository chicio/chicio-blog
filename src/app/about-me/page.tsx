import { AboutMe } from "@/components/sections/about-me/components/about-me";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/site-metadata";
import { slugs } from "@/types/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return createMetadata({
    author: siteMetadata.author,
    title: siteMetadata.title,
    description: siteMetadata.description,
    slug: slugs.art,
    imageUrl: siteMetadata.featuredImage,
    ogPageType: "profile",
  });
}

export default async function AboutMePage() {
  return (
    <AboutMe />
  );
}
