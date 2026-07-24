"use client";

import { useSearch } from "@/components/design-system/hooks/use-search";
import { terminalOverlayOpenEvent } from "@/components/design-system/state/terminal/terminal-events";
import { searchIndexFileName } from "@/lib/content/search-filename";
import { filesystemManifestFileName } from "@/lib/terminal/filesystem-filename";
import { toMarkdownFetchUrl } from "@/lib/terminal/terminal-markdown-route";
import { getAppRootElement } from "@/lib/terminal/terminal-overlay-dom";
import { applyCompletion, completeInput } from "@/lib/terminal/terminal-completion";
import { execute, formatSearchResults, needsFilesystem, parse } from "@/lib/terminal/terminal-engine";
import { ROOT_PATH, resolveRouteForPopstate } from "@/lib/terminal/terminal-path";
import { toScreenLines } from "@/lib/terminal/terminal-screen-lines";
import type { TerminalScrollbackEntry } from "@/lib/terminal/terminal-screen-lines";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { ComponentStore } from "@/types/component-store";
import type { SearchResult } from "@/types/search/search";
import type { TerminalContentBlockData, TerminalDirNode, TerminalRenderContentIntent } from "@/types/terminal/terminal";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";

interface TerminalState {
    open: boolean;
    lines: TerminalScrollbackEntry[];
    cwd: string;
    input: string;
    completions: string[];
    announcement: string;
}

interface TerminalEffects {
    setInputElement: (el: HTMLInputElement | null) => void;
    setScrollAnchorElement: (el: HTMLDivElement | null) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleCompletionSelect: (completion: string) => () => void;
    closeOverlay: () => void;
    stopPropagation: (e: React.MouseEvent) => void;
}

const noopEasterEgg = (): SearchResult | null => null;

const EMPTY_ROOT: TerminalDirNode = { type: "dir", children: {} };

const FETCH_TIMEOUT_MS = 8000;

const BOOT_LINES: TerminalScrollbackEntry[] = [
    { id: "boot-0", text: "chicio://terminal v1.0 - Matrix shell interface", kind: "success" },
    { id: "boot-1", text: "establishing connection to fabrizioduroni.it... done.", kind: "normal" },
    { id: "boot-2", text: 'type "help" for a list of commands, "ls" to look around.', kind: "normal" },
];

const createBlockId = (): string =>
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `content-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export const useTerminalStore = (): ComponentStore<TerminalState, TerminalEffects> => {
    const router = useRouter();

    const [open, setOpen] = useState(false);
    const [triggerEl, setTriggerEl] = useState<HTMLElement | null>(null);
    const [root, setRoot] = useState<TerminalDirNode | null>(null);
    const [cwd, setCwd] = useState(ROOT_PATH);
    const [lines, setLines] = useState<TerminalScrollbackEntry[]>(BOOT_LINES);
    const [input, setInput] = useState("");
    const [completions, setCompletions] = useState<string[]>([]);
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number | null>(null);
    const [announcement, setAnnouncement] = useState("");
    const [pendingSearchQuery, setPendingSearchQuery] = useState<string | null>(null);
    const [inputEl, setInputEl] = useState<HTMLInputElement | null>(null);
    const [scrollAnchorEl, setScrollAnchorEl] = useState<HTMLDivElement | null>(null);

    const { handleSearch, search } = useSearch(true, noopEasterEgg, searchIndexFileName);
    const [previousSearch, setPreviousSearch] = useState(search);

    if (previousSearch !== search) {
        setPreviousSearch(search);

        if (pendingSearchQuery !== null && search.type === "search") {
            const { lines: resultLines, announcement: resultAnnouncement } = formatSearchResults(
                pendingSearchQuery,
                search.results,
            );

            setLines((prev) => [...prev, ...toScreenLines(resultLines, prev.length)]);
            setAnnouncement(resultAnnouncement);
            setPendingSearchQuery(null);
        }
    }

    useEffect(() => {
        fetch(`/${filesystemManifestFileName}`)
            .then((response) => response.json())
            .then((manifest: { root: TerminalDirNode }) => setRoot(manifest.root))
            .catch(() => {
                setLines((prev) => [
                    ...prev,
                    ...toScreenLines([{ text: "failed to load the filesystem manifest.", kind: "error" }], prev.length),
                ]);
            });
    }, []);

    useEffect(() => {
        const handleOpenEvent = () => {
            setTriggerEl(document.activeElement instanceof HTMLElement ? document.activeElement : null);
            setOpen(true);
            setAnnouncement("terminal opened");
        };

        window.addEventListener(terminalOverlayOpenEvent, handleOpenEvent);
        return () => window.removeEventListener(terminalOverlayOpenEvent, handleOpenEvent);
    }, []);

    useEffect(() => {
        const appRoot = getAppRootElement();

        if (!appRoot) {
            return;
        }

        if (open) {
            appRoot.setAttribute("inert", "");
            appRoot.setAttribute("aria-hidden", "true");
        } else {
            appRoot.removeAttribute("inert");
            appRoot.removeAttribute("aria-hidden");
        }

        return () => {
            appRoot.removeAttribute("inert");
            appRoot.removeAttribute("aria-hidden");
        };
    }, [open]);

    useEffect(() => {
        inputEl?.focus();
    }, [inputEl]);

    useEffect(() => {
        scrollAnchorEl?.scrollIntoView({ block: "end" });
    }, [lines, scrollAnchorEl]);

    const closeOverlay = useCallback(() => {
        setOpen(false);
        setAnnouncement("terminal closed");
        triggerEl?.focus();
    }, [triggerEl]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handleEsc = (e: globalThis.KeyboardEvent) => {
            if (e.key === "Escape") {
                closeOverlay();
            }
        };

        window.addEventListener("keydown", handleEsc, true);
        return () => window.removeEventListener("keydown", handleEsc, true);
    }, [open, closeOverlay]);

    const updateContentBlock = useCallback((id: string, patch: Partial<TerminalContentBlockData>) => {
        setLines((prev) =>
            prev.map((item) => (item.kind === "content" && item.id === id ? { ...item, ...patch } : item)),
        );
    }, []);

    const fetchContentBlockMarkdown = useCallback(
        async (blockId: string, route: string) => {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

            try {
                const response = await fetch(toMarkdownFetchUrl(route), { signal: controller.signal });
                clearTimeout(timeoutId);

                if (response.ok) {
                    const markdown = await response.text();
                    updateContentBlock(blockId, { status: "success", markdown });
                    return;
                }

                updateContentBlock(blockId, { status: response.status === 404 ? "unavailable" : "error" });
            } catch {
                clearTimeout(timeoutId);
                updateContentBlock(blockId, { status: "error" });
            }
        },
        [updateContentBlock],
    );

    const renderContentFor = useCallback(
        (intent: TerminalRenderContentIntent) => {
            const block: TerminalContentBlockData = {
                id: createBlockId(),
                kind: "content",
                route: intent.route,
                title: intent.title,
                status: "loading",
            };

            setLines((prev) => [...prev, block]);
            void fetchContentBlockMarkdown(block.id, intent.route);
        },
        [fetchContentBlockMarkdown],
    );

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePopState = () => {
            const pathname = window.location.pathname;
            const target = root
                ? resolveRouteForPopstate(root, pathname)
                : { path: null, title: pathname, route: pathname };

            if (target.path) {
                setCwd(target.path);
            }

            setAnnouncement(`now viewing ${target.title}`);
            renderContentFor({ route: target.route, title: target.title, historyInert: true });
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [open, root, renderContentFor]);

    const runCommand = useCallback(
        (rawInput: string) => {
            const trimmed = rawInput.trim();

            if (trimmed.length === 0) {
                return;
            }

            setHistory((prev) => [...prev, trimmed]);
            setHistoryIndex(null);

            const promptText = `${cwd} $ ${trimmed}`;
            const command = parse(trimmed);

            if (!root && needsFilesystem(command.name)) {
                setLines((prev) => [
                    ...prev,
                    { id: `line-${prev.length}`, text: promptText, kind: "prompt" },
                    {
                        id: `line-${prev.length + 1}`,
                        text: "filesystem is still loading, try again in a moment.",
                        kind: "error",
                    },
                ]);
                setAnnouncement("filesystem is still loading");
                return;
            }

            const result = execute(command, cwd, root ?? EMPTY_ROOT);

            setLines((prev) => {
                if (result.clearScreen) {
                    return [];
                }

                const promptLine: TerminalScrollbackEntry = { id: `line-${prev.length}`, text: promptText, kind: "prompt" };
                const resultScreenLines = toScreenLines(result.lines, prev.length + 1);

                return [...prev, promptLine, ...resultScreenLines];
            });

            setCwd(result.newCwd);
            setAnnouncement(result.announcement ?? "");

            if (result.navigateTo) {
                trackWith({
                    category: tracking.category.terminal,
                    label: result.navigateTo,
                    action: tracking.action.terminal_open,
                });
                router.push(result.navigateTo);
            }

            if (result.renderContent) {
                renderContentFor(result.renderContent);
            }

            if (result.searchQuery) {
                setPendingSearchQuery(result.searchQuery);
                handleSearch({ target: { value: result.searchQuery } } as ChangeEvent<HTMLInputElement>);
            }

            if (result.close) {
                closeOverlay();
            }
        },
        [cwd, root, router, handleSearch, renderContentFor, closeOverlay],
    );

    const handleSubmit = useCallback(
        (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            runCommand(input);
            setInput("");
            setCompletions([]);
        },
        [input, runCommand],
    );

    const handleInputChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            setInput(value);
            setCompletions(root && value.trim().length > 0 ? completeInput(value, cwd, root) : []);
        },
        [cwd, root],
    );

    const handleKeyDown = useCallback(
        (e: KeyboardEvent<HTMLInputElement>) => {
            if (e.key === "Tab") {
                e.preventDefault();

                if (completions.length === 1) {
                    const completed = applyCompletion(input, completions[0]);
                    setInput(completed);
                    setCompletions(root ? completeInput(completed, cwd, root) : []);
                }

                return;
            }

            if (e.key === "ArrowUp") {
                e.preventDefault();

                if (history.length === 0) {
                    return;
                }

                const nextIndex = historyIndex === null ? history.length - 1 : Math.max(historyIndex - 1, 0);
                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
                return;
            }

            if (e.key === "ArrowDown") {
                e.preventDefault();

                if (historyIndex === null) {
                    return;
                }

                const nextIndex = historyIndex + 1;

                if (nextIndex >= history.length) {
                    setHistoryIndex(null);
                    setInput("");
                    return;
                }

                setHistoryIndex(nextIndex);
                setInput(history[nextIndex]);
            }
        },
        [completions, input, cwd, root, history, historyIndex],
    );

    const handleCompletionSelect = useCallback(
        (completion: string) => () => {
            const completed = applyCompletion(input, completion);
            setInput(completed);
            setCompletions(root ? completeInput(completed, cwd, root) : []);
            inputEl?.focus();
        },
        [input, cwd, root, inputEl],
    );

    const stopPropagation = useCallback((e: React.MouseEvent) => e.stopPropagation(), []);

    return {
        state: { open, lines, cwd, input, completions, announcement },
        effects: {
            setInputElement: setInputEl,
            setScrollAnchorElement: setScrollAnchorEl,
            handleInputChange,
            handleKeyDown,
            handleSubmit,
            handleCompletionSelect,
            closeOverlay,
            stopPropagation,
        },
    };
};
