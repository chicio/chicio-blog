import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { render, screen, act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableOfContents } from "./table-of-contents";
import type { ContentHeading } from "@/types/content/heading";

const { mockUseReducedMotions } = vi.hoisted(() => ({
    mockUseReducedMotions: vi.fn(),
}));

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

vi.mock("@/components/design-system/hooks/use-reduced-motions", () => ({
    useReducedMotions: mockUseReducedMotions,
}));

type IntersectionObserverCallback = (entries: Partial<IntersectionObserverEntry>[]) => void;

let capturedObserverCallback: IntersectionObserverCallback | undefined;
const mockObserve = vi.fn();
const mockDisconnect = vi.fn();

class FakeIntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {
        capturedObserverCallback = callback;
    }
    observe = mockObserve;
    unobserve = vi.fn();
    disconnect = mockDisconnect;
}

// Matches `scrollSpyCommitDelayMs` in `use-table-of-contents-store.ts`: the store debounces the actual
// `activeId` state commit by this long after the last intersection crossing, so a fast native anchor jump
// never re-renders (and so never competes with) an in-flight browser scroll animation.
const scrollSpyCommitDelayMs = 500;

const fireIntersection = (id: string, isIntersecting: boolean) => {
    act(() => {
        capturedObserverCallback?.([{ target: { id } as Element, isIntersecting }]);
        vi.advanceTimersByTime(scrollSpyCommitDelayMs);
    });
};

beforeAll(() => {
    vi.stubGlobal("IntersectionObserver", FakeIntersectionObserver);
});

const heading = (level: 2 | 3, id: string, text: string, minutes = 1): ContentHeading => ({
    level,
    id,
    text,
    readingTime: { text: `${minutes} min read`, minutes, time: minutes * 60000, words: minutes * 200 },
});

const flatHeadings: ContentHeading[] = [
    heading(2, "introduction", "Introduction"),
    heading(2, "operations", "Operations"),
    heading(2, "examples", "Examples"),
];

const nestedHeadings: ContentHeading[] = [
    heading(2, "introduction", "Introduction"),
    heading(3, "memory", "Memory Representation"),
    heading(2, "operations", "Operations"),
];

const h3OnlyHeadings: ContentHeading[] = [
    heading(3, "one", "One"),
    heading(3, "two", "Two"),
    heading(3, "three", "Three"),
];

describe("TableOfContents", () => {
    beforeEach(() => {
        capturedObserverCallback = undefined;
        mockObserve.mockClear();
        mockDisconnect.mockClear();
        mockUseReducedMotions.mockReturnValue(false);
        document.documentElement.classList.remove("reading-companion-smooth-scroll");
        Element.prototype.scrollIntoView = vi.fn();
        // jsdom has no elements carrying the heading ids in these tests (the real headings live in the
        // page's own MDX content, rendered elsewhere) — stub getElementById so the scroll-spy effect always
        // finds an "element" to observe, and scroll-spy tests can drive the captured observer callback.
        vi.spyOn(document, "getElementById").mockImplementation((id) => ({ id }) as unknown as HTMLElement);
        vi.spyOn(window.history, "pushState").mockImplementation(() => undefined);
    });

    afterEach(() => {
        document.documentElement.classList.remove("reading-companion-smooth-scroll");
        vi.restoreAllMocks();
    });

    describe("render", () => {
        it("renders a collapsed details element with a Contents summary", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getByText("Contents").closest("details")).not.toHaveAttribute("open");
        });

        it("renders every heading as a real navigable link, with its own reading time", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getAllByRole("link", { name: /Introduction/ })).toHaveLength(2);
            expect(screen.getAllByRole("link", { name: /Operations/ })).toHaveLength(2);
            expect(screen.getAllByRole("link", { name: /Examples/ })).toHaveLength(2);
            const [entry] = screen.getAllByRole("link", { name: /Introduction/ });
            expect(entry).toHaveAttribute("href", "#introduction");
        });

        it("nests an h3 under its preceding h2 inside a collapsible group with its own toggle", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            expect(screen.getAllByRole("link", { name: /Memory Representation/ })).toHaveLength(2);
            expect(screen.getAllByRole("link", { name: /^Introduction/ })).toHaveLength(2);
            expect(screen.getAllByRole("button", { name: /Toggle Introduction section/ })).toHaveLength(2);
        });

        it("never nests an h3 under a preceding h3-only group, so an h3-only document stays flat", () => {
            render(<TableOfContents headings={h3OnlyHeadings} />);
            expect(screen.queryAllByRole("button", { name: /Toggle One section/ })).toHaveLength(0);
            expect(screen.getAllByRole("link", { name: /^One/ })).toHaveLength(2);
            expect(screen.getAllByRole("link", { name: /^Two/ })).toHaveLength(2);
            expect(screen.getAllByRole("link", { name: /^Three/ })).toHaveLength(2);
        });

        it("renders two nav landmarks with distinct accessible names (inline + xl rail)", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getAllByRole("navigation", { name: "Table of contents" })).toHaveLength(1);
            expect(screen.getAllByRole("navigation", { name: "Table of contents (sidebar)" })).toHaveLength(1);
        });

        it("never places an <li> directly inside another <li> without an intervening <ul>", () => {
            const { container } = render(<TableOfContents headings={nestedHeadings} />);
            expect(container.querySelectorAll("li > li")).toHaveLength(0);
        });

        it("gives a childless h2 the same top-level styling as a group heading, not the muted h3 style", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            const [topLevel] = screen.getAllByRole("link", { name: /^Operations/ });
            const [child] = screen.getAllByRole("link", { name: /Memory Representation/ });
            expect(topLevel).not.toHaveClass("text-sm");
            expect(child).toHaveClass("text-sm");
        });
    });

    describe("interaction", () => {
        it("expands the inline details on click", async () => {
            render(<TableOfContents headings={flatHeadings} />);
            const summary = screen.getByText("Contents");
            await userEvent.click(summary);
            expect(summary.closest("details")).toHaveAttribute("open");
        });

        it("fires the toggle tracking callback when the inline details is toggled", async () => {
            const onToggle = vi.fn();
            render(<TableOfContents headings={flatHeadings} tracking={{ onToggle, onNavigate: vi.fn() }} />);
            await userEvent.click(screen.getByText("Contents"));
            expect(onToggle).toHaveBeenCalled();
        });

        it("fires the navigate tracking callback via a real, unprevented anchor click", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={flatHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [entry] = screen.getAllByRole("link", { name: /Introduction/ });
            expect(entry).toHaveAttribute("href", "#introduction");

            await userEvent.click(entry);

            expect(onNavigate).toHaveBeenCalledWith("Introduction");
            // The handler no longer drives navigation itself (that was the scroll-abort root cause): it must
            // never call the router-observed pushState, and must never preventDefault the native anchor jump.
            expect(window.history.pushState).not.toHaveBeenCalled();
        });

        it("navigates to a group heading that has children via its own anchor", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={nestedHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [groupLink] = screen.getAllByRole("link", { name: /^Introduction/ });
            await userEvent.click(groupLink);
            expect(onNavigate).toHaveBeenCalledWith("Introduction");
            expect(window.history.pushState).not.toHaveBeenCalled();
        });

        it("expands an h3 group via its own toggle control, without firing the navigate callback", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={nestedHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [toggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
            expect(toggle).toHaveAttribute("aria-expanded", "false");
            await userEvent.click(toggle);
            expect(toggle).toHaveAttribute("aria-expanded", "true");
            expect(onNavigate).not.toHaveBeenCalled();
        });
    });

    describe("scroll-spy", () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it("marks the intersecting heading as the current location", () => {
            render(<TableOfContents headings={flatHeadings} />);
            fireIntersection("operations", true);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
        });

        // Regression coverage for the scroll-abort bug: committing `activeId` synchronously on every
        // intersection crossing re-renders both TOC surfaces on every one of them, which (measured directly
        // against this codebase's own DSA content) can stall the browser's own smooth-scroll animation for
        // a long native anchor jump. Debouncing the commit is what stops that competition; this test locks
        // in the "no immediate commit" half of that fix so a future change can't silently drop it.
        it("does not commit the intersecting heading immediately, only after the debounce settles", () => {
            render(<TableOfContents headings={flatHeadings} />);
            act(() => {
                capturedObserverCallback?.([{ target: { id: "operations" } as Element, isIntersecting: true }]);
            });
            const [entryRightAfter] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entryRightAfter).not.toHaveAttribute("aria-current", "location");

            act(() => {
                vi.advanceTimersByTime(scrollSpyCommitDelayMs);
            });
            const [entryAfterSettling] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entryAfterSettling).toHaveAttribute("aria-current", "location");
        });

        it("resets the debounce on every new crossing, so only the last one before it settles ever commits", () => {
            render(<TableOfContents headings={flatHeadings} />);
            act(() => {
                capturedObserverCallback?.([{ target: { id: "introduction" } as Element, isIntersecting: true }]);
            });
            act(() => {
                vi.advanceTimersByTime(scrollSpyCommitDelayMs - 100);
                capturedObserverCallback?.([{ target: { id: "operations" } as Element, isIntersecting: true }]);
                vi.advanceTimersByTime(scrollSpyCommitDelayMs - 100);
            });
            const [introductionEntry] = screen.getAllByRole("link", { name: /^Introduction/ });
            const [operationsEntry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(introductionEntry).not.toHaveAttribute("aria-current", "location");
            expect(operationsEntry).not.toHaveAttribute("aria-current", "location");

            act(() => {
                vi.advanceTimersByTime(100);
            });
            const [finalOperationsEntry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(finalOperationsEntry).toHaveAttribute("aria-current", "location");
        });

        it("keeps the last active heading highlighted while the reader is between two headings", () => {
            render(<TableOfContents headings={flatHeadings} />);
            fireIntersection("operations", true);
            fireIntersection("operations", false);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
        });

        it("marks the ancestor group heading as current on both surfaces when a child heading is active", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("memory", true);
            const [inlineGroupLink, railGroupLink] = screen.getAllByRole("link", { name: /^Introduction/ });
            expect(inlineGroupLink).toHaveClass("font-bold");
            expect(railGroupLink).toHaveClass("font-bold");
        });

        it("marks a childless h2 as current when it itself is the intersecting heading", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("operations", true);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
            expect(entry).toHaveClass("font-bold");
        });

        // The rail sits outside the document's normal flow (fixed, `xl` and up), so scroll-spy is free to
        // force it open reactively at no layout cost. The inline copy lives in the article's own flow, so
        // it must stay purely user-driven — see the "inline copy" describe below for that half of the
        // contract.
        describe("rail surface", () => {
            it("force-opens the ancestor group when a child heading becomes active", () => {
                render(<TableOfContents headings={nestedHeadings} />);
                fireIntersection("memory", true);
                const [, railToggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
                expect(railToggle).toHaveAttribute("aria-expanded", "true");
            });

            it("lets the reader collapse a group that scroll-spy is currently forcing open", () => {
                render(<TableOfContents headings={nestedHeadings} />);
                fireIntersection("memory", true);
                const [, railToggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
                expect(railToggle).toHaveAttribute("aria-expanded", "true");

                fireEvent.click(railToggle);

                expect(railToggle).toHaveAttribute("aria-expanded", "false");
            });

            it("keeps a manually-closed group closed after scroll-spy moves away from it", () => {
                render(<TableOfContents headings={nestedHeadings} />);
                fireIntersection("memory", true);
                const [, railToggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
                fireEvent.click(railToggle);
                expect(railToggle).toHaveAttribute("aria-expanded", "false");

                fireIntersection("operations", true);

                expect(railToggle).toHaveAttribute("aria-expanded", "false");
            });

            it("scrolls the newly active entry into view within its own scrollable box", () => {
                render(<TableOfContents headings={flatHeadings} />);
                fireIntersection("operations", true);
                const [, railEntry] = screen.getAllByRole("link", { name: /^Operations/ });
                expect(railEntry.scrollIntoView).toHaveBeenCalledWith({ block: "nearest" });
            });
        });

        describe("inline copy", () => {
            it("never force-opens a group just because scroll-spy made it the active ancestor", () => {
                render(<TableOfContents headings={nestedHeadings} />);
                fireIntersection("memory", true);
                const [inlineToggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
                expect(inlineToggle).toHaveAttribute("aria-expanded", "false");
            });

            it("still opens on an explicit click regardless of scroll-spy state", () => {
                render(<TableOfContents headings={nestedHeadings} />);
                fireIntersection("memory", true);
                const [inlineToggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });

                fireEvent.click(inlineToggle);

                expect(inlineToggle).toHaveAttribute("aria-expanded", "true");
            });
        });
    });

    describe("motion", () => {
        it("adds the smooth-scroll class to the document root by default", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(document.documentElement).toHaveClass("reading-companion-smooth-scroll");
        });

        it("does not add the smooth-scroll class when the user prefers reduced motion", () => {
            mockUseReducedMotions.mockReturnValue(true);
            render(<TableOfContents headings={flatHeadings} />);
            expect(document.documentElement).not.toHaveClass("reading-companion-smooth-scroll");
        });

        it("removes the smooth-scroll class on unmount", () => {
            const { unmount } = render(<TableOfContents headings={flatHeadings} />);
            expect(document.documentElement).toHaveClass("reading-companion-smooth-scroll");

            unmount();

            expect(document.documentElement).not.toHaveClass("reading-companion-smooth-scroll");
        });
    });
});
