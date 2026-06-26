"use client";

import type { EffectsStore } from "@/types/component-store";

interface SearchResultItemEffects {
    handleSelect: () => void;
}

export const useSearchResultItemStore = (slug: string, onSelect: (slug: string) => void): EffectsStore<SearchResultItemEffects> => {
    const handleSelect = () => onSelect(slug);

    return {
        effects: { handleSelect },
    };
};
