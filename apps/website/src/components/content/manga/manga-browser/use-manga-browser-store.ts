"use client";

import { ChangeEvent, useCallback, useState } from "react";
import { ComponentStore } from "matrix-component-store";
import { Content } from "@/types/content/content";
import { MangaMetadata } from "@/types/content/manga";

interface MangaBrowserState {
    query: string;
    filteredMangas: Content<MangaMetadata>[];
}

interface MangaBrowserEffects {
    handleFilter: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useMangaBrowserStore = (
    mangas: Content<MangaMetadata>[],
): ComponentStore<MangaBrowserState, MangaBrowserEffects> => {
    const [query, setQuery] = useState("");

    const handleFilter = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    }, []);

    const lowerQuery = query.trim().toLowerCase();
    const filteredMangas = mangas.filter((manga) => manga.frontmatter.title.toLowerCase().includes(lowerQuery));

    return {
        state: { query, filteredMangas },
        effects: { handleFilter },
    };
};
