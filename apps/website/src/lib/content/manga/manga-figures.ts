import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";

export const isMangaComplete = ({ volumesOwned, volumes }: MangaMetadata): boolean => volumesOwned >= volumes;

export const volumesOwnedLabel = (metadata: MangaMetadata): string =>
    `${metadata.volumesOwned}/${metadata.volumes}${isMangaComplete(metadata) ? " ✓" : ""}`;

export const serializationLabel = ({ serializationStartYear, serializationEndYear }: MangaMetadata): string =>
    `${serializationStartYear} – ${serializationEndYear ?? "present"}`;

export type MangaCollectionFigures = {
    manga: number;
    volumes: number;
    complete: number;
    authors: number;
};

/** The collection's headline numbers, counted from the content: Volumes are the ones owned, authors are distinct. */
export const collectionFigures = (mangas: Content<MangaMetadata>[]): MangaCollectionFigures => {
    const allMetadata = mangas.flatMap((manga) => (manga.frontmatter.metadata ? [manga.frontmatter.metadata] : []));

    return {
        manga: mangas.length,
        volumes: allMetadata.reduce((total, metadata) => total + metadata.volumesOwned, 0),
        complete: allMetadata.filter(isMangaComplete).length,
        authors: new Set(allMetadata.flatMap((metadata) => [...metadata.storyBy, ...metadata.artBy])).size,
    };
};
