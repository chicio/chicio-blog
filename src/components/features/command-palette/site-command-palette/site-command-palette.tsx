"use client";

import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import {
    CommandPalette,
    CommandPaletteGroup,
    CommandPaletteItem,
    ToggleMotionItem,
} from "@/components/design-system/organism/command-palette";
import { BiChat } from "react-icons/bi";
import { FC } from "react";
import { CustomizeMatrixRainItem } from "./customize-matrix-rain-item";
import { EasterEggHuntItem } from "./easter-egg-hunt-item";
import { SearchResultItem } from "./search-result-item";
import { TerminalItem } from "./terminal-item";
import { useSiteCommandPaletteStore, type SiteCommandPaletteTracking } from "./use-site-command-palette-store";

export interface SiteCommandPaletteProps {
    searchIndexFileName: string;
    chatSlug: string;
    easterEggHuntSlug: string;
    tracking?: SiteCommandPaletteTracking;
    matchesEasterEggQuery?: (query: string) => boolean;
    onEasterEggMatch?: () => void;
}

export const SiteCommandPalette: FC<SiteCommandPaletteProps> = ({
    searchIndexFileName,
    chatSlug,
    easterEggHuntSlug,
    tracking,
    matchesEasterEggQuery,
    onEasterEggMatch,
}) => {
    const { state, effects } = useSiteCommandPaletteStore(
        searchIndexFileName,
        chatSlug,
        easterEggHuntSlug,
        tracking,
        matchesEasterEggQuery,
        onEasterEggMatch,
    );
    const { isSearching, search } = state;
    const {
        handleOpenChange,
        handleQueryChange,
        handleOpenChat,
        handleOpenEasterEggHunt,
        handleOpenTerminal,
        handleSearchResultSelect,
    } = effects;

    const hasSearchResults = search.type === "search" && search.results.length > 0;

    return (
        <CommandPalette onOpenChange={handleOpenChange} onQueryChange={handleQueryChange}>
            {isSearching && hasSearchResults && (
                <CommandPaletteGroup label="Content">
                    {search.results.map((result, i) => (
                        <SearchResultItem
                            key={`result-${i}`}
                            title={result.title}
                            description={result.description}
                            slug={result.slug}
                            onSelect={handleSearchResultSelect}
                        />
                    ))}
                </CommandPaletteGroup>
            )}
            {isSearching && !hasSearchResults && (
                <div className="text-accent/40 px-4 py-6 text-center font-mono text-xs">{">"} no results found_</div>
            )}
            {!isSearching && (
                <CommandPaletteGroup label="Quick Actions">
                    <CommandPaletteItem value="open ai chat" onSelect={handleOpenChat}>
                        <TerminalLine>
                            <BiChat className="mr-2 mb-0.5 inline" />
                            {">"} Open chat
                        </TerminalLine>
                    </CommandPaletteItem>
                    <EasterEggHuntItem onSelect={handleOpenEasterEggHunt} />
                    <TerminalItem onSelect={handleOpenTerminal} />
                    <ToggleMotionItem onTrack={tracking?.onToggleMotion} />
                    <CustomizeMatrixRainItem onTrack={tracking?.onCustomizeMatrixRain} />
                </CommandPaletteGroup>
            )}
        </CommandPalette>
    );
};
