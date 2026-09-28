import { MangaCollection } from "@/components/content/manga/manga-collection";
import { mangaHome } from "@/lib/content/manga/manga";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
    const { frontmatter } = mangaHome.single()!;

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        description: frontmatter.description,
        slug: slugs.manga.home,
        imageUrl: frontmatter.image,
        ogPageType: "website",
        keywords: frontmatter.tags,
    });
}

export default function MangaCollectionPage() {
    return <MangaCollection />;
}
