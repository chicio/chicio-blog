"use client";

import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { MotionDiv } from "@/components/design-system/molecules/animation/motion-div";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { useSearch } from "@/components/design-system/utils/hooks/use-search";
import { useMotionStore } from "@/components/design-system/utils/hooks/use-motion-store";
import { commandPaletteOpenEvent } from "@/lib/command-palette/command-palette-events";
import { writeMotion } from "@/lib/motion/motion";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { whiteRabbitEasterEgg } from "@/components/sections/easter-eggs/components/white-rabbit";
import { Command } from "cmdk";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ChangeEvent, FC, PropsWithChildren, useEffect, useState } from "react";
import { BiChat } from "react-icons/bi";
import { MdAnimation, MdDoDisturb } from "react-icons/md";

const NeoRoomEasterEgg = dynamic(
    () => import("@/components/sections/easter-eggs/components/neo-room-easter-egg"),
    { ssr: false },
);

const ITEM_CLASS =
    "px-4 py-2 cursor-pointer aria-selected:bg-[var(--color-accent-alpha-10)] aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

const GroupLabel: FC<PropsWithChildren> = ({ children }) => (
    <div className="px-4 py-1 font-mono text-xs text-accent/50 uppercase tracking-wider">{children}</div>
);

export const CommandPalette = () => {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");

    const router = useRouter();
    const motionEnabled = useMotionStore();
    const { glassmorphismClass } = useGlassmorphism({ noScale: true });
    const { handleSearch, resetSearch, search } = useSearch(open, whiteRabbitEasterEgg);

    const close = () => {
        setOpen(false);
        setQuery("");
        resetSearch();
    };

    // ⌘K toggle + open-palette custom event — stable, registered once.
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setOpen((prev) => !prev);
            }
        };
        const handleOpenEvent = () => {
            setOpen(true);
            trackWith({
                category: tracking.category.command_palette,
                label: tracking.label.header,
                action: tracking.action.command_palette_open,
            });
        };
        document.addEventListener("keydown", handleKeyDown, true);
        window.addEventListener(commandPaletteOpenEvent, handleOpenEvent);
        return () => {
            document.removeEventListener("keydown", handleKeyDown, true);
            window.removeEventListener(commandPaletteOpenEvent, handleOpenEvent);
        };
    }, []);

    // ESC to close — only registered while open so we don't interfere with other handlers.
    useEffect(() => {
        if (!open) return;
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", handleEsc, true);
        return () => document.removeEventListener("keydown", handleEsc, true);
        // close calls stable React setters; safe stale ref.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);

    const handleToggleMotion = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_toggle_motion,
        });
        writeMotion(motionEnabled ? "off" : "on");
        close();
    };

    const handleOpenChat = () => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_open_chat,
        });
        router.push(slugs.chat);
        close();
    };

    const handleSearchResultSelect = (slug: string) => {
        trackWith({
            category: tracking.category.command_palette,
            label: tracking.label.body,
            action: tracking.action.command_palette_search_result_selected,
        });
        router.push(slug);
        close();
    };

    const isSearching = query.trim().length >= 3;
    const hasSearchResults = search.type === "search" && search.results.length > 0;

    return (
        <AnimatePresence>
            {open && (
                <Overlay key="command-palette-overlay" delay={0} onClick={close} className="z-50">
                    {search.type === "easterEgg" ? (
                        <NeoRoomEasterEgg lines={search.terminalLines} />
                    ) : (
                        <div
                            className="flex justify-center items-start min-h-screen pt-[15vh] px-4"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <MotionDiv
                                className={`${glassmorphismClass} w-full max-w-[600px] overflow-hidden`}
                                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ duration: 0.15, ease: "easeOut" }}
                            >
                                <Command shouldFilter={false} className="flex flex-col">
                                    <div className="flex items-center gap-2 px-4 py-3 border-b border-accent/20">
                                        <span className="text-accent font-mono font-bold text-sm text-shadow-md shrink-0">
                                            {">"}
                                        </span>
                                        <Command.Input
                                            className="bg-transparent outline-none text-accent font-mono text-sm flex-1 placeholder:text-accent/40 caret-accent"
                                            placeholder="type to search blog posts_"
                                            onValueChange={(value) => {
                                                setQuery(value);
                                                handleSearch({
                                                    target: { value },
                                                } as ChangeEvent<HTMLInputElement>);
                                            }}
                                            autoFocus
                                        />
                                    </div>

                                    {/* key toggles between "search" and "idle" so cmdk resets its
                                        internal selection index when switching modes — without this,
                                        the first ↓ selects from the bottom. */}
                                    <Command.List
                                        key={isSearching ? "search" : "idle"}
                                        className="max-h-[55vh] overflow-y-auto py-2"
                                    >
                                        {isSearching && hasSearchResults && (
                                            <Command.Group>
                                                <GroupLabel>Blog Posts</GroupLabel>
                                                {search.results.map((result, i) => (
                                                    <Command.Item
                                                        key={`result-${i}`}
                                                        value={result.title}
                                                        className={ITEM_CLASS}
                                                        onSelect={() => handleSearchResultSelect(result.slug)}
                                                    >
                                                        <TerminalLine>
                                                            {">"} {result.title}
                                                        </TerminalLine>
                                                        <p className="font-mono text-xs text-primary-text/60 ml-4 line-clamp-1 leading-tight">
                                                            {result.description}
                                                        </p>
                                                    </Command.Item>
                                                ))}
                                            </Command.Group>
                                        )}

                                        {isSearching && !hasSearchResults && (
                                            <div className="px-4 py-6 font-mono text-xs text-accent/40 text-center">
                                                {">"} no results found_
                                            </div>
                                        )}

                                        {!isSearching && (
                                            <Command.Group>
                                                <GroupLabel>Quick Actions</GroupLabel>
                                                <Command.Item
                                                    value="open ai chat"
                                                    className={ITEM_CLASS}
                                                    onSelect={handleOpenChat}
                                                >
                                                    <TerminalLine>
                                                        <BiChat className="inline mr-2 mb-0.5" />
                                                        {">"} Open AI Chat
                                                    </TerminalLine>
                                                </Command.Item>
                                                <Command.Item
                                                    value="toggle animations motion"
                                                    className={ITEM_CLASS}
                                                    onSelect={handleToggleMotion}
                                                >
                                                    <TerminalLine>
                                                        {motionEnabled ? (
                                                            <MdDoDisturb className="inline mr-2 mb-0.5" />
                                                        ) : (
                                                            <MdAnimation className="inline mr-2 mb-0.5" />
                                                        )}
                                                        {">"} Toggle Animations{" "}
                                                        <span className="ml-1 text-accent/60 font-mono text-xs">
                                                            [{motionEnabled ? "ON" : "OFF"}]
                                                        </span>
                                                    </TerminalLine>
                                                </Command.Item>
                                            </Command.Group>
                                        )}
                                    </Command.List>

                                    <div className="px-4 py-2 border-t border-accent/20 font-mono text-xs text-accent/40 flex gap-6">
                                        <span>↑↓ navigate</span>
                                        <span>↵ select</span>
                                        <span>esc close</span>
                                    </div>
                                </Command>
                            </MotionDiv>
                        </div>
                    )}
                </Overlay>
            )}
        </AnimatePresence>
    );
};
