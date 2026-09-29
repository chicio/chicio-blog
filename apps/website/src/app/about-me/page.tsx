import { AboutMe } from "@/components/content/about-me/about-me";
import { aboutMe } from "@/lib/content/about-me/about-me";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = aboutMe.single()!;

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slugs.aboutMe,
        imageUrl: frontmatter.image,
        ogPageType: "profile",
        keywords: frontmatter.tags,
    });
}

export default async function AboutMePage() {
    return <AboutMe />;
}
