import { Manga } from "@/components/content/manga/manga";
import { siblingsOf } from "@/lib/content/siblings";
import { mangas } from "@/lib/content/manga/manga";
import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { NextMangaParameters } from "@/types/next/page-parameters";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: NextMangaParameters): Promise<Metadata> {
    const receivedParameters = await params;
    const manga = mangas.single(receivedParameters);

    if (!manga) {
        return {};
    }

    const { frontmatter } = manga;

    return createMetadata({
        author: siteMetadata.author,
        title: frontmatter.title,
        slug: manga.slug.formatted,
        imageUrl: frontmatter.image,
        description: frontmatter.description,
        ogPageType: "website",
        keywords: frontmatter.tags,
    });
}

export async function generateStaticParams() {
    return mangas.list().map((manga) => manga.slug.params);
}

export default async function MangaPage({ params }: NextMangaParameters) {
    const receivedParameters = await params;
    const manga = mangas.single(receivedParameters);

    if (!manga) {
        notFound();
    }

    const siblings = siblingsOf(mangas.list(), manga.slug.formatted);

    return <Manga manga={manga} previous={siblings?.previous} next={siblings?.next} />;
}
