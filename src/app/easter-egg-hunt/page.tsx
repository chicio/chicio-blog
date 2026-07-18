import { EasterEggs } from "@/components/content/easter-eggs/easter-eggs";
import { createMetadata } from "@/lib/seo/seo";
import { easterEggHuntPageDescription, easterEggHuntPageTitle } from "@/lib/content/easter-eggs/easter-eggs-content";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    return createMetadata({
        author: siteMetadata.author,
        title: `${easterEggHuntPageTitle} fabrizioduroni.it | Fabrizio Duroni`,
        description: easterEggHuntPageDescription,
        slug: slugs.easterEggHunt,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    });
}

export default function EasterEggHuntPage() {
    return <EasterEggs />;
}
