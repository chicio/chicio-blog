"use client";

import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/hooks/use-glassmorphism";
import type { EasterEggTerminalLines, SearchResult } from "@/types/search/search";
import { motion } from "framer-motion";
import { ComponentType, FC } from "react";
import { BiChat } from "react-icons/bi";
import { Command } from "cmdk";
import { ToggleMotionItem } from "@/components/design-system/organism/command-palette/command-palette/toggle-motion-item";
import { CustomizeMatrixRainItem } from "@/components/design-system/organism/command-palette/command-palette/customize-matrix-rain-item";
import { SearchResultItem } from "@/components/design-system/organism/command-palette/command-palette/search-result-item";
import { EasterEggHuntItem } from "@/components/design-system/organism/command-palette/command-palette/easter-egg-hunt-item";
import { useCommandPaletteStore } from "./use-command-palette-store";

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

const GroupLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="text-accent/50 px-4 py-1 font-mono text-xs tracking-wider uppercase">{children}</div>
);

interface CommandPaletteTrackingProps {
    onOpen?: () => void;
    onOpenChat?: () => void;
    onSearchResultSelect?: () => void;
    onToggleMotion?: () => void;
    onCustomizeMatrixRain?: () => void;
    onOpenEasterEggHunt?: () => void;
}

interface CommandPaletteProps {
    searchIndexFileName: string;
    chatSlug: string;
    easterEggHuntSlug: string;
    tracking?: CommandPaletteTrackingProps;
    searchEasterEgg?: (query: string) => SearchResult | null;
    SearchEasterEggComponent?: ComponentType<{ lines: EasterEggTerminalLines }>;
}

export const CommandPalette: FC<CommandPaletteProps> = ({
    searchIndexFileName,
    chatSlug,
    easterEggHuntSlug,
    tracking,
    searchEasterEgg,
    SearchEasterEggComponent,
}) => {
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });
    const { state, effects } = useCommandPaletteStore(
        searchIndexFileName,
        chatSlug,
        easterEggHuntSlug,
        tracking,
        searchEasterEgg,
        SearchEasterEggComponent,
    );
    const { open, isSearching, selectedValue, search, easterEggLines } = state;
    const {
        close,
        stopPropagation,
        handleSearchInput,
        handleOpenChat,
        handleOpenEasterEggHunt,
        handleSearchResultSelect,
        setSelectedValue,
        onToggleMotion,
        handleCustomizeMatrixRainClose,
    } = effects;

    const hasSearchResults = search.type === "search" && search.results.length > 0;

    if (!open) {
        return null;
    }

    return (
        <Overlay delay={0} onClick={close} className="z-50">
            {easterEggLines && SearchEasterEggComponent ? (
                <SearchEasterEggComponent lines={easterEggLines} />
            ) : (
                <div className="flex min-h-screen items-start justify-center px-4 pt-[15vh]">
                    <motion.div
                        className={`${glassmorphismClass} w-full max-w-150 overflow-hidden`}
                        initial={{ opacity: 0, scale: 0.95, y: -8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        onClick={stopPropagation}
                    >
                        <Command
                            shouldFilter={false}
                            className="flex flex-col"
                            value={selectedValue}
                            onValueChange={setSelectedValue}
                        >
                            <div className="border-accent/20 flex items-center gap-2 border-b px-4 py-3">
                                <span className="text-accent shrink-0 font-mono text-sm font-bold text-shadow-md">
                                    {">"}
                                </span>
                                <Command.Input
                                    className="text-accent placeholder:text-accent/40 caret-accent flex-1 bg-transparent font-mono text-base outline-none"
                                    placeholder="type to search_"
                                    onValueChange={handleSearchInput}
                                    autoFocus
                                />
                            </div>

                            <Command.List className="max-h-[55vh] overflow-y-auto py-2">
                                {isSearching && hasSearchResults && (
                                    <Command.Group>
                                        <GroupLabel>Content</GroupLabel>
                                        {search.results.map((result, i) => (
                                            <SearchResultItem
                                                key={`result-${i}`}
                                                title={result.title}
                                                description={result.description}
                                                slug={result.slug}
                                                onSelect={handleSearchResultSelect}
                                            />
                                        ))}
                                    </Command.Group>
                                )}
                                {isSearching && !hasSearchResults && (
                                    <div className="text-accent/40 px-4 py-6 text-center font-mono text-xs">
                                        {">"} no results found_
                                    </div>
                                )}
                                {!isSearching && (
                                    <Command.Group>
                                        <GroupLabel>Quick Actions</GroupLabel>
                                        <Command.Item value="open ai chat" className={ITEM_CLASS} onSelect={handleOpenChat}>
                                            <TerminalLine>
                                                <BiChat className="mr-2 mb-0.5 inline" />
                                                {">"} Open chat
                                            </TerminalLine>
                                        </Command.Item>
                                        <EasterEggHuntItem onSelect={handleOpenEasterEggHunt} />
                                        <ToggleMotionItem onTrack={onToggleMotion} />
                                        <CustomizeMatrixRainItem onClose={handleCustomizeMatrixRainClose} />
                                    </Command.Group>
                                )}
                            </Command.List>
                            <div className="border-accent/20 text-accent/40 xs:flex hidden gap-6 border-t px-4 py-2 font-mono text-xs">
                                <span>↑↓ navigate</span>
                                <span>↵ select</span>
                                <span>esc close</span>
                            </div>
                        </Command>
                    </motion.div>
                </div>
            )}
        </Overlay>
    );
};
