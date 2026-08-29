import { EasterEggs } from "@/components/content/easter-eggs/easter-eggs";
import { createMetadata } from "@/lib/seo/seo";
import { easterEggHunt } from "@/lib/content/easter-eggs/easter-eggs";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = easterEggHunt.single()!;

    return createMetadata({
        author: siteMetadata.author,
        title: `${frontmatter.title} fabrizioduroni.it | Fabrizio Duroni`,
        description: frontmatter.description,
        slug: slugs.easterEggHunt,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default function EasterEggHuntPage() {
    return <EasterEggs />;
}
