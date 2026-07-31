import { describe, it, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableOfContents } from "./table-of-contents";
import type { ContentHeading } from "@/types/content/heading";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
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

const fireIntersection = (id: string, isIntersecting: boolean) => {
    act(() => {
        capturedObserverCallback?.([{ target: { id } as Element, isIntersecting }]);
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
        // jsdom has no elements carrying the heading ids in these tests (the real headings live in the
        // page's own MDX content, rendered elsewhere) — stub getElementById so the effect always finds an
        // "element" to observe/scroll to, and scroll-spy tests can drive the captured observer callback.
        vi.spyOn(document, "getElementById").mockImplementation(
            (id) => ({ id, scrollIntoView: vi.fn() }) as unknown as HTMLElement,
        );
        vi.spyOn(window.history, "pushState").mockImplementation(() => undefined);
    });

    afterEach(() => {
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

        it("fires the navigate tracking callback and pushes the anchor hash, without a full navigation", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={flatHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [entry] = screen.getAllByRole("link", { name: /Introduction/ });
            await userEvent.click(entry);
            expect(onNavigate).toHaveBeenCalledWith("Introduction");
            expect(window.history.pushState).toHaveBeenCalledWith(null, "", "#introduction");
        });

        it("scrolls smoothly by default, and instantly when motion is reduced", async () => {
            const el = { id: "introduction", scrollIntoView: vi.fn() };
            vi.spyOn(document, "getElementById").mockImplementation((id) =>
                id === "introduction" ? (el as unknown as HTMLElement) : null,
            );
            render(<TableOfContents headings={flatHeadings} />);
            const [entry] = screen.getAllByRole("link", { name: /Introduction/ });
            await userEvent.click(entry);
            expect(el.scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth", block: "start" });
        });

        it("navigates to a group heading that has children via its own anchor", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={nestedHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [groupLink] = screen.getAllByRole("link", { name: /^Introduction/ });
            await userEvent.click(groupLink);
            expect(onNavigate).toHaveBeenCalledWith("Introduction");
            expect(window.history.pushState).toHaveBeenCalledWith(null, "", "#introduction");
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
        it("marks the intersecting heading as the current location", () => {
            render(<TableOfContents headings={flatHeadings} />);
            fireIntersection("operations", true);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
        });

        it("keeps the last active heading highlighted while the reader is between two headings", () => {
            render(<TableOfContents headings={flatHeadings} />);
            fireIntersection("operations", true);
            fireIntersection("operations", false);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
        });

        it("marks the ancestor group heading as current, and force-opens it, when a child heading is active", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("memory", true);
            const [groupLink] = screen.getAllByRole("link", { name: /^Introduction/ });
            const [toggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
            expect(groupLink).toHaveClass("font-bold");
            expect(toggle).toHaveAttribute("aria-expanded", "true");
        });

        it("marks a childless h2 as current when it itself is the intersecting heading", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("operations", true);
            const [entry] = screen.getAllByRole("link", { name: /^Operations/ });
            expect(entry).toHaveAttribute("aria-current", "location");
            expect(entry).toHaveClass("font-bold");
        });

        it("lets the reader collapse a group that scroll-spy is currently forcing open", async () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("memory", true);
            const [toggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
            expect(toggle).toHaveAttribute("aria-expanded", "true");

            await userEvent.click(toggle);

            expect(toggle).toHaveAttribute("aria-expanded", "false");
        });

        it("keeps a manually-closed group closed after scroll-spy moves away from it", async () => {
            render(<TableOfContents headings={nestedHeadings} />);
            fireIntersection("memory", true);
            const [toggle] = screen.getAllByRole("button", { name: /Toggle Introduction section/ });
            await userEvent.click(toggle);
            expect(toggle).toHaveAttribute("aria-expanded", "false");

            fireIntersection("operations", true);

            expect(toggle).toHaveAttribute("aria-expanded", "false");
        });
    });
});
