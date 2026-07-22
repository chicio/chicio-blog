"use client";

import { useSearch } from "@/components/design-system/hooks/use-search";
import { searchIndexFileName } from "@/lib/content/search-filename";
import { filesystemManifestFileName } from "@/lib/terminal/filesystem-filename";
import { applyCompletion, completeInput } from "@/lib/terminal/terminal-completion";
import { execute, formatSearchResults, parse } from "@/lib/terminal/terminal-engine";
import { ROOT_PATH } from "@/lib/terminal/terminal-path";
import { toScreenLines } from "@/lib/terminal/terminal-screen-lines";
import type { TerminalScreenLine } from "@/lib/terminal/terminal-screen-lines";
import type { ComponentStore } from "@/types/component-store";
import type { SearchResult } from "@/types/search/search";
import type { TerminalDirNode } from "@/types/terminal/terminal";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, KeyboardEvent, useCallback, useEffect, useState } from "react";

interface TerminalState {
    lines: TerminalScreenLine[];
    cwd: string;
    input: string;
    completions: string[];
    announcement: string;
    hasRunCommands: boolean;
}

interface TerminalEffects {
    setInputElement: (el: HTMLInputElement | null) => void;
    setScrollAnchorElement: (el: HTMLDivElement | null) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
    handleCompletionSelect: (completion: string) => () => void;
}

const noopEasterEgg = (): SearchResult | null => null;

const BOOT_LINES: TerminalScreenLine[] = [
    { id: "boot-0", text: "chicio://terminal v1.0 - Matrix shell interface", kind: "success" },
    { id: "boot-1", text: "establishing connection to fabrizioduroni.it... done.", kind: "normal" },
    { id: "boot-2", text: 'type "help" for a list of commands, "ls" to look around.', kind: "normal" },
];

export const useTerminalStore = (): ComponentStore<TerminalState, TerminalEffects> => {
    const router = useRouter();

    const [root, setRoot] = useState<TerminalDirNode | null>(null);
    const [cwd, setCwd] = useState(ROOT_PATH);
    const [lines, setLines] = useState<TerminalScreenLine[]>(BOOT_LINES);
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
        inputEl?.focus();
    }, [inputEl]);

    useEffect(() => {
        scrollAnchorEl?.scrollIntoView({ block: "end" });
    }, [lines, scrollAnchorEl]);

    const runCommand = useCallback(
        (rawInput: string) => {
            const trimmed = rawInput.trim();

            if (trimmed.length === 0) {
                return;
            }

            setHistory((prev) => [...prev, trimmed]);
            setHistoryIndex(null);

            const promptText = `${cwd} $ ${trimmed}`;

            if (!root) {
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

            const command = parse(trimmed);
            const result = execute(command, cwd, root);

            setLines((prev) => {
                if (result.clearScreen) {
                    return [];
                }

                const promptLine: TerminalScreenLine = { id: `line-${prev.length}`, text: promptText, kind: "prompt" };
                const resultScreenLines = toScreenLines(result.lines, prev.length + 1);

                return [...prev, promptLine, ...resultScreenLines];
            });

            setCwd(result.newCwd);
            setAnnouncement(result.announcement ?? "");

            if (result.navigateTo) {
                router.push(result.navigateTo);
            }

            if (result.searchQuery) {
                setPendingSearchQuery(result.searchQuery);
                handleSearch({ target: { value: result.searchQuery } } as ChangeEvent<HTMLInputElement>);
            }
        },
        [cwd, root, router, handleSearch],
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

    return {
        state: { lines, cwd, input, completions, announcement, hasRunCommands: history.length > 0 },
        effects: {
            setInputElement: setInputEl,
            setScrollAnchorElement: setScrollAnchorEl,
            handleInputChange,
            handleKeyDown,
            handleSubmit,
            handleCompletionSelect,
        },
    };
};
