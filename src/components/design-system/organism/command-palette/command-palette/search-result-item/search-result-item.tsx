"use client";

import { FC } from "react";
import { Command } from "cmdk";
import { TerminalListItem } from "@/components/design-system/molecules/terminal-list-item";
import { useSearchResultItemStore } from "./use-search-result-item-store";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

interface SearchResultItemProps {
    title: string;
    description: string;
    slug: string;
    onSelect: (slug: string) => void;
}

export const SearchResultItem: FC<SearchResultItemProps> = ({ title, description, slug, onSelect }) => {
    const { effects } = useSearchResultItemStore(slug, onSelect);
    const { handleSelect } = effects;

    return (
        <Command.Item value={title} className={ITEM_CLASS} onSelect={handleSelect}>
            <TerminalListItem title={title} description={description} />
        </Command.Item>
    );
};
