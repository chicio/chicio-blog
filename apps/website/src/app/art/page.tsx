import { Art } from "@/components/content/art/art";
import { art } from "@/lib/content/art/art";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = art.single()!;

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slugs.art,
        imageUrl: frontmatter.image,
        ogPageType: "website",
        keywords: frontmatter.tags,
    });
}

export default async function ArtPage() {
    return <Art />;
}
