"use client";

import { TerminalListItem } from "@/components/design-system/molecules/terminal-list-item";
import { CommandPaletteItem } from "@/components/design-system/organism/command-palette";
import { FC } from "react";
import { useSearchResultItemStore } from "./use-search-result-item-store";

export interface SearchResultItemProps {
    title: string;
    description: string;
    slug: string;
    onSelect: (slug: string) => void;
}

export const SearchResultItem: FC<SearchResultItemProps> = ({ title, description, slug, onSelect }) => {
    const { effects } = useSearchResultItemStore(slug, onSelect);
    const { handleSelect } = effects;

    return (
        <CommandPaletteItem value={title} onSelect={handleSelect}>
            <TerminalListItem title={title} description={description} />
        </CommandPaletteItem>
    );
};
