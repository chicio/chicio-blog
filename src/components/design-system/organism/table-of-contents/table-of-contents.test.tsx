import { describe, it, expect, vi, beforeAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TableOfContents } from "./table-of-contents";
import type { ContentHeading } from "@/types/content/heading";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

beforeAll(() => {
    vi.stubGlobal(
        "IntersectionObserver",
        class {
            observe = vi.fn();
            unobserve = vi.fn();
            disconnect = vi.fn();
        },
    );
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

describe("TableOfContents", () => {
    describe("render", () => {
        it("renders a collapsed details element with a Contents summary", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getByText("Contents").closest("details")).not.toHaveAttribute("open");
        });

        it("renders every heading as a navigable entry, with its own reading time", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getAllByText("Introduction").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Operations").length).toBeGreaterThan(0);
            expect(screen.getAllByText("Examples").length).toBeGreaterThan(0);
            expect(screen.getAllByText(/1 min read/).length).toBeGreaterThan(0);
        });

        it("nests an h3 under its preceding h2 inside a collapsible group", () => {
            render(<TableOfContents headings={nestedHeadings} />);
            expect(screen.getAllByText("Memory Representation").length).toBeGreaterThan(0);
            expect(screen.getAllByRole("button", { name: /Introduction/ }).length).toBeGreaterThan(0);
        });

        it("renders two nav landmarks labelled for the table of contents (inline + 2xl rail)", () => {
            render(<TableOfContents headings={flatHeadings} />);
            expect(screen.getAllByRole("navigation", { name: "Table of contents" })).toHaveLength(2);
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

        it("fires the navigate tracking callback with the heading text when an entry is clicked", async () => {
            const onNavigate = vi.fn();
            render(<TableOfContents headings={flatHeadings} tracking={{ onToggle: vi.fn(), onNavigate }} />);
            const [entry] = screen.getAllByRole("button", { name: /Introduction/ });
            await userEvent.click(entry);
            expect(onNavigate).toHaveBeenCalledWith("Introduction");
        });

        it("expands an h3 group on click even without any tracking callbacks provided", async () => {
            render(<TableOfContents headings={nestedHeadings} />);
            const [groupTrigger] = screen.getAllByRole("button", { name: /Introduction/ });
            await userEvent.click(groupTrigger);
            expect(groupTrigger).toHaveAttribute("aria-expanded", "true");
        });
    });
});
