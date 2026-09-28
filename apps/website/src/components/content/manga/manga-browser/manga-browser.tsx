"use client";

import { FC } from "react";
import { FaBookOpen } from "react-icons/fa";
import { EmptyState, FilterInput } from "matrix-design-system";
import { MangaCard } from "@/components/content/manga/manga-card";
import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";
import { useMangaBrowserStore } from "./use-manga-browser-store";

interface MangaBrowserProps {
    mangas: Content<MangaMetadata>[];
}

export const MangaBrowser: FC<MangaBrowserProps> = ({ mangas }) => {
    const { state, effects } = useMangaBrowserStore(mangas);
    const { query, filteredMangas } = state;
    const { handleFilter } = effects;

    return (
        <div className="flex flex-col gap-6">
            <FilterInput value={query} onChange={handleFilter} placeholder="Search manga..." />
            {filteredMangas.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    {filteredMangas.map((manga) => (
                        <MangaCard key={manga.slug.formatted} manga={manga} />
                    ))}
                </div>
            ) : (
                <EmptyState icon={<FaBookOpen />} subject="manga" query={query} />
            )}
        </div>
    );
};
