"use client";

import { Overlay } from "@/components/design-system/atoms/effects/overlay";
import { TerminalLine } from "@/components/design-system/atoms/typography/terminal-blocks";
import { useGlassmorphism } from "@/components/design-system/utils/hooks/use-glassmorphism";
import { useSearch } from "@/components/design-system/utils/hooks/use-search";
import { commandPaletteOpenEvent } from "@/lib/command-palette/command-palette-events";
import { motion } from "framer-motion";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import { slugs } from "@/types/configuration/slug";
import { whiteRabbitEasterEgg } from "@/components/features/easter-eggs/components/white-rabbit";
import { Command } from "cmdk";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FC,
  PropsWithChildren,
  useCallback,
  useEffect,
  useState,
} from "react";
import { BiChat } from "react-icons/bi";
import { ToggleMotionItem } from "./toggle-motion-item";

const NeoRoomEasterEgg = dynamic(
  () =>
    import("@/components/features/easter-eggs/components/neo-room-easter-egg"),
  { ssr: false },
);

const ITEM_CLASS =
  "px-4 py-2 cursor-pointer aria-selected:bg-accent-alpha-10 aria-selected:border-l-2 aria-selected:border-accent transition-colors duration-100";

const GroupLabel: FC<PropsWithChildren> = ({ children }) => (
  <div className="text-accent/50 px-4 py-1 font-mono text-xs tracking-wider uppercase">
    {children}
  </div>
);

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedValue, setSelectedValue] = useState("open ai chat");
  const { handleSearch, resetSearch, search } = useSearch(
    open,
    whiteRabbitEasterEgg,
  );
  const [previousSearch, setPreviousSearch] = useState(search);
  const router = useRouter();
  const { glassmorphismClass } = useGlassmorphism({ noScale: true });

  if (previousSearch !== search) {
    setPreviousSearch(search);
    setSelectedValue(
      search.type === "search" && search.results.length > 0
        ? search.results[0].title
        : "open ai chat",
    );
  }

  const close = useCallback(() => {
    setOpen(false);
    setIsSearching(false);
    resetSearch();
  }, [resetSearch]);

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

    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener(commandPaletteOpenEvent, handleOpenEvent);

    return () => {
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener(commandPaletteOpenEvent, handleOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
      }
    };

    window.addEventListener("keydown", handleEsc, true);

    return () => window.removeEventListener("keydown", handleEsc, true);
  }, [open, close]);

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

  const hasSearchResults =
    search.type === "search" && search.results.length > 0;

  if (!open) {
    return null;
  }

  return (
    <Overlay delay={0} onClick={close} className="z-50">
      {search.type === "easterEgg" ? (
        <NeoRoomEasterEgg lines={search.terminalLines} />
      ) : (
        <div className="flex min-h-screen items-start justify-center px-4 pt-[15vh]">
          <motion.div
            className={`${glassmorphismClass} w-full max-w-150 overflow-hidden`}
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
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
                  onValueChange={(value) => {
                    setIsSearching(value.trim().length >= 3);
                    handleSearch({
                      target: { value },
                    } as ChangeEvent<HTMLInputElement>);
                  }}
                  autoFocus
                />
              </div>

              <Command.List className="max-h-[55vh] overflow-y-auto py-2">
                {isSearching && hasSearchResults && (
                  <Command.Group>
                    <GroupLabel>Content</GroupLabel>
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
                        <p className="text-primary-text/60 ml-4 line-clamp-1 font-mono text-xs leading-tight">
                          {result.description}
                        </p>
                      </Command.Item>
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
                    <Command.Item
                      value="open ai chat"
                      className={ITEM_CLASS}
                      onSelect={handleOpenChat}
                    >
                      <TerminalLine>
                        <BiChat className="mr-2 mb-0.5 inline" />
                        {">"} Open chat
                      </TerminalLine>
                    </Command.Item>
                    <ToggleMotionItem />
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

export default CommandPalette;
