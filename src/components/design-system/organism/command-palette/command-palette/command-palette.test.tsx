import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CommandPalette } from "./command-palette";

const { stableSearchResult, stableHandleSearch, stableResetSearch } = vi.hoisted(() => ({
    stableSearchResult: { type: "search" as const, results: [] },
    stableHandleSearch: vi.fn(),
    stableResetSearch: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
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

vi.mock("matrix-rain-webgpu", () => ({
    isWebGPUSupported: () => false,
}));

vi.mock("@/components/design-system/hooks/use-search", () => ({
    useSearch: () => ({
        handleSearch: stableHandleSearch,
        resetSearch: stableResetSearch,
        search: stableSearchResult,
        isPending: false,
    }),
}));

vi.mock("@/components/design-system/state/command-palette/command-palette-events", () => ({
    commandPaletteOpenEvent: "command-palette-open",
    openCommandPalette: vi.fn(),
    openMatrixRainPanel: vi.fn(),
}));

vi.mock("@/components/design-system/state/motion/motion", () => ({
    writeMotion: vi.fn(),
    hasMotion: () => true,
    motionChangeEvent: "motion-change",
}));

describe("CommandPalette", () => {
    describe("when closed", () => {
        it("renders nothing before being opened", () => {
            const { container } = render(
                <CommandPalette searchIndexFileName="search.json" chatSlug="/chat" />,
            );
            expect(container.firstChild).toBeNull();
        });
    });

    describe("when opened via keyboard shortcut", () => {
        it("renders the search input after Ctrl+K is pressed", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" />);
            fireEvent.keyDown(window, { key: "k", ctrlKey: true });
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });

        it("shows quick actions when not searching", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" />);
            fireEvent.keyDown(window, { key: "k", ctrlKey: true });
            expect(screen.getByText(/Open chat/)).toBeInTheDocument();
        });

        it("closes on Escape key", () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" />);
            fireEvent.keyDown(window, { key: "k", ctrlKey: true });
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
            fireEvent.keyDown(window, { key: "Escape" });
            expect(screen.queryByPlaceholderText("type to search_")).toBeNull();
        });
    });

    describe("when opened via custom event", () => {
        it("renders after the command-palette-open event fires", async () => {
            render(<CommandPalette searchIndexFileName="search.json" chatSlug="/chat" />);
            await act(async () => {
                window.dispatchEvent(new CustomEvent("command-palette-open"));
            });
            expect(screen.getByPlaceholderText("type to search_")).toBeInTheDocument();
        });
    });
});
