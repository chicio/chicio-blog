import { slugs } from "@/types/configuration/slug";
import { MangaMetadata } from "@/types/content/manga";
import { createSection } from "../section";

/** The manga landing page itself: its own MDX carries the section intro and its metadata. */
export const mangaHome = createSection({ slug: slugs.manga.home });

/** One entry per series (a Manga), never per Volume; sorted by title. */
export const mangas = createSection<MangaMetadata>({
    slug: slugs.manga.manga,
    sort: (manga, anotherManga) => manga.frontmatter.title.localeCompare(anotherManga.frontmatter.title),
});
