import { FC } from "react";
import { StatCard } from "matrix-design-system";
import { mangas } from "@/lib/content/manga/manga";
import { collectionFigures } from "@/components/content/manga/manga-figures";

/**
 * The collection's headline numbers. Counted from the content rather than written down, so they cannot
 * fall behind the collection. Placed by `src/content/manga/content.mdx`.
 */
export const MangaStats: FC = () => {
    const figures = collectionFigures(mangas.list());

    return (
        <div className="mt-10 mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
            <StatCard value={figures.manga} label="Manga" />
            <StatCard value={figures.volumes} label="Volumes" />
            <StatCard value={figures.complete} label="Complete" />
            <StatCard value={figures.authors} label="Authors" />
        </div>
    );
};
