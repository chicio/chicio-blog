"use client";

import { ChangeEvent, useCallback, useState } from "react";
import type { ComponentStore } from "@/types/component-store";
import type { AuthorSummary } from "@/types/content/author";

interface BlogAuthorsState {
    query: string;
    filteredAuthors: AuthorSummary[];
}

interface BlogAuthorsEffects {
    handleFilter: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const useBlogAuthorsStore = (
    authors: AuthorSummary[],
): ComponentStore<BlogAuthorsState, BlogAuthorsEffects> => {
    const [query, setQuery] = useState("");
    const [filteredAuthors, setFilteredAuthors] = useState(authors);

    const handleFilter = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setQuery(value);
            const lower = value.toLowerCase();
            setFilteredAuthors(authors.filter((entry) => entry.author.name.toLowerCase().includes(lower)));
        },
        [authors],
    );

    return {
        state: { query, filteredAuthors },
        effects: { handleFilter },
    };
};
