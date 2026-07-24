import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SearchResult } from "@/types/search/search";
import { CommandPalette } from "./command-palette";

const { mockRouterPush } = vi.hoisted(() => ({
    mockRouterPush: vi.fn(),
}));

const { stableHandleSearch, stableResetSearch, openMatrixRainPanel, openTerminalOverlay } = vi.hoisted(() => ({
    stableHandleSearch: vi.fn(),
    stableResetSearch: vi.fn(),
    openMatrixRainPanel: vi.fn(),
    openTerminalOverlay: vi.fn(),
}));

const searchMockState = vi.hoisted(() => ({
    current: { type: "search", results: [] } as SearchResult,
}));

const { mockUseWebGpuSupported, mockUseReducedMotions } = vi.hoisted(() => ({
    mockUseWebGpuSupported: vi.fn(() => true),
    mockUseReducedMotions: vi.fn(() => false),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockRouterPush }),
    usePathname: () => "/",
}));

vi.mock("framer-motion", () => ({
    motion: {
        div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

vi.mock("cmdk", () => ({
    Command: Object.assign(
        ({
            children,
            ...props
        }: React.HTMLAttributes<HTMLDivElement> & { shouldFilter?: boolean; value?: string; onValueChange?: (v: string) => void }) => (
            <div {...props}>{children}</div>
        ),
        {
            Input: ({
                onValueChange,
                placeholder,
                ...rest
            }: React.InputHTMLAttributes<HTMLInputElement> & { onValueChange?: (v: string) => void }) => (
                <input
                    placeholder={placeholder}
                    onChange={(e) => onValueChange?.(e.target.value)}
                    {...rest}
                />
            ),
            List: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
                <div {...props}>{children}</div>
            ),
            Group: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
            Item: ({
                children,
                onSelect,
                value,
            }: React.PropsWithChildren<{ onSelect?: () => void; value?: string }>) => (
                <div role="option" aria-label={value} onClick={onSelect}>
                    {children}
                </div>
            ),
        },
    ),
}));

vi.mock("@/components/design-system/hooks/use-search", () => ({
    useSearch: () => ({
        handleSearch: stableHandleSearch,
        resetSearch: stableResetSearch,
        search: searchMockState.current,
        isPending: false,
    }),
}));

vi.mock("@/components/design-system/hooks/use-webgpu-supported", () => ({
    useWebGpuSupported: mockUseWebGpuSupported,
}));

vi.mock("@/components/design-system/hooks/use-reduced-motions", () => ({
    useReducedMotions: mockUseReducedMotions,
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    commandPaletteOpenEvent: "command-palette-open",
    openCommandPalette: vi.fn(),
    openMatrixRainPanel,
}));

vi.mock("@/components/design-system/state/terminal/terminal-events", () => ({
    terminalOverlayOpenEvent: "terminal-overlay-open",
    openTerminalOverlay,
}));

vi.mock("@/components/design-system/state/motion/motion", () => ({
    writeMotion: vi.fn(),
    hasMotion: () => true,
    motionChangeEvent: "motion-change",
}));

const openViaShortcut = () => fireEvent.keyDown(window, { key: "k", ctrlKey: true });

describe("CommandPalette", () => {
    beforeEach(() => {
        mockRouterPush.mockClear();
        stableHandleSearch.mockClear();
        stableResetSearch.mockClear();
        openMatrixRainPanel.mockClear();
        openTerminalOverlay.mockClear();
        mockUseWebGpuSupported.mockReturnValue(true);
        mockUseReducedMotions.mockReturnValue(false);
        searchMockState.current = { type: "search", results: [] };
    });

    describe("when closed", () => {
        it("renders nothing before being opened", () => {
            const { container } = render(
                <CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />,
            );
            expect(container.firstChild).toBeNull();
        });
    });

    describe("opening the palette", () => {
        it("renders the search input after Ctrl+K is pressed", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });

        it("renders the search input after Cmd+K (metaKey) is pressed", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            fireEvent.keyDown(window, { key: "k", metaKey: true });
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });

        it("shows quick actions when not searching", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            expect(screen.getByText(/Open chat/)).toBeInTheDocument();
        });

        it("closes on Escape key", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
            fireEvent.keyDown(window, { key: "Escape" });
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });

        it("renders and fires tracking.onOpen after the command-palette-open event fires", async () => {
            const onOpen = vi.fn();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onOpen }}
                />,
            );
            await act(async () => {
                window.dispatchEvent(new CustomEvent("command-palette-open"));
            });
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
            expect(onOpen).toHaveBeenCalledOnce();
        });
    });

    describe("dismissing the palette", () => {
        it("closes when clicking the overlay backdrop", () => {
            const { container } = render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
            fireEvent.click(container.firstChild as Element);
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });

        it("does not close when clicking inside the dialog", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            const input = screen.getByPlaceholderText("type to search_");
            fireEvent.click(input);
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });
    });

    describe("search input", () => {
        it("stays on quick actions when the query is under 3 characters", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            fireEvent.change(screen.getByPlaceholderText("type to search_"), { target: { value: "ab" } });
            expect(screen.getByText(/Open chat/)).toBeInTheDocument();
            expect(screen.queryByText(/no results found_/)).toBeNull();
        });

        it("ignores leading/trailing whitespace when checking the minimum length", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            fireEvent.change(screen.getByPlaceholderText("type to search_"), { target: { value: "  ab " } });
            expect(screen.getByText(/Open chat/)).toBeInTheDocument();
        });

        it("switches to searching state at exactly 3 characters", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            fireEvent.change(screen.getByPlaceholderText("type to search_"), { target: { value: "abc" } });
            expect(screen.queryByText(/Open chat/)).toBeNull();
            expect(screen.getByText(/no results found_/)).toBeInTheDocument();
        });

        it("shows search results returned by the index", () => {
            searchMockState.current = {
                type: "search",
                results: [
                    { slug: "/blog/post-1", title: "First Post", description: "desc 1", tags: [], authors: [] },
                ],
            };
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" easterEggHuntSlug="/easter-egg-hunt" />);
            openViaShortcut();
            fireEvent.change(screen.getByPlaceholderText("type to search_"), { target: { value: "post" } });
            expect(screen.getByRole("option", { name: "First Post" })).toBeInTheDocument();
        });
    });

    describe("quick actions", () => {
        it("navigates to chat, fires tracking and closes when 'Open chat' is selected", async () => {
            const onOpenChat = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onOpenChat }}
                />,
            );
            openViaShortcut();
            await user.click(screen.getByRole("option", { name: "open ai chat" }));
            expect(mockRouterPush).toHaveBeenCalledWith("/chat");
            expect(onOpenChat).toHaveBeenCalledOnce();
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });

        it("navigates to the easter egg hunt page, fires tracking and closes when 'Easter Egg Hunt' is selected", async () => {
            const onOpenEasterEggHunt = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onOpenEasterEggHunt }}
                />,
            );
            openViaShortcut();
            await user.click(screen.getByRole("option", { name: "easter egg hunt" }));
            expect(mockRouterPush).toHaveBeenCalledWith("/easter-egg-hunt");
            expect(onOpenEasterEggHunt).toHaveBeenCalledOnce();
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });

        it("opens the terminal overlay in place, fires tracking and closes when 'Open terminal' is selected", async () => {
            const onOpenTerminal = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onOpenTerminal }}
                />,
            );
            openViaShortcut();
            await user.click(screen.getByRole("option", { name: "open terminal" }));
            expect(openTerminalOverlay).toHaveBeenCalledOnce();
            expect(mockRouterPush).not.toHaveBeenCalled();
            expect(onOpenTerminal).toHaveBeenCalledOnce();
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });

        it("fires tracking.onToggleMotion without closing the palette", async () => {
            const onToggleMotion = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onToggleMotion }}
                />,
            );
            openViaShortcut();
            await user.click(screen.getByRole("option", { name: "toggle animations motion" }));
            expect(onToggleMotion).toHaveBeenCalledOnce();
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });

        it("fires tracking, opens the matrix rain panel and closes when 'Customize Matrix Rain' is selected", async () => {
            const onCustomizeMatrixRain = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onCustomizeMatrixRain }}
                />,
            );
            openViaShortcut();
            await user.click(screen.getByRole("option", { name: "customize matrix rain" }));
            expect(onCustomizeMatrixRain).toHaveBeenCalledOnce();
            expect(openMatrixRainPanel).toHaveBeenCalledOnce();
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });
    });

    describe("search results", () => {
        it("navigates to the result slug, fires tracking and closes when a result is selected", async () => {
            searchMockState.current = {
                type: "search",
                results: [
                    { slug: "/blog/post-1", title: "First Post", description: "desc 1", tags: [], authors: [] },
                ],
            };
            const onSearchResultSelect = vi.fn();
            const user = userEvent.setup();
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    tracking={{ onSearchResultSelect }}
                />,
            );
            openViaShortcut();
            fireEvent.change(screen.getByPlaceholderText("type to search_"), { target: { value: "post" } });
            await user.click(screen.getByRole("option", { name: "First Post" }));
            expect(mockRouterPush).toHaveBeenCalledWith("/blog/post-1");
            expect(onSearchResultSelect).toHaveBeenCalledOnce();
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });
    });

    describe("easter egg", () => {
        it("renders the easter egg component instead of the search dialog", () => {
            searchMockState.current = {
                type: "easterEgg",
                terminalLines: [{ text: "you found neo" }],
            };
            const SearchEasterEggComponent = ({ lines }: { lines: { text: string }[] }) => (
                <div data-testid="easter-egg">{lines.map((line) => line.text).join(",")}</div>
            );
            render(
                <CommandPalette
                    searchIndexFileName="search.json"
                    chatSlug="/chat"
                    easterEggHuntSlug="/easter-egg-hunt"
                    searchEasterEgg={() => null}
                    SearchEasterEggComponent={SearchEasterEggComponent}
                />,
            );
            openViaShortcut();
            expect(screen.getByTestId("easter-egg")).toHaveTextContent("you found neo");
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });
    });
});
