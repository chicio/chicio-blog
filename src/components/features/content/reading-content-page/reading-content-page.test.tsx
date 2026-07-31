import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { ReadingContentPage } from "./reading-content-page";

vi.mock("@/components/design-system/templates/reading-content-page-template", () => ({
    ReadingContentPageTemplate: ({
        children,
        navHrefs,
        footerNavHrefs,
        socialLinks,
        headerWrapper: _hw,
        headings,
        tableOfContentsTracking,
        ...rest
    }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <div
            data-testid="reading-content-page-template"
            data-has-nav-hrefs={!!navHrefs}
            data-headings-count={Array.isArray(headings) ? headings.length : 0}
            data-has-table-of-contents-tracking={!!tableOfContentsTracking}
            {...(rest as object)}
        >
            {children}
        </div>
    ),
}));

vi.mock("@/components/features/easter-eggs/dejavu", () => ({
    DejavuEasterEgg: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("ReadingContentPage", () => {
    describe("render", () => {
        it("renders the reading content page template", () => {
            render(<ReadingContentPage author="Fabrizio" />);
            expect(screen.getByTestId("reading-content-page-template")).toBeInTheDocument();
        });

        it("passes nav hrefs to the template", () => {
            render(<ReadingContentPage author="Fabrizio" />);
            expect(screen.getByTestId("reading-content-page-template")).toHaveAttribute(
                "data-has-nav-hrefs",
                "true",
            );
        });

        it("renders children", () => {
            render(
                <ReadingContentPage author="Fabrizio">
                    <p>article body</p>
                </ReadingContentPage>,
            );
            expect(screen.getByText("article body")).toBeInTheDocument();
        });

        it("forwards the headings prop through to the template", () => {
            const headings = [{ level: 2 as const, id: "a", text: "A", readingTime: { text: "", minutes: 0, time: 0, words: 0 } }];
            render(<ReadingContentPage author="Fabrizio" headings={headings} />);
            expect(screen.getByTestId("reading-content-page-template")).toHaveAttribute("data-headings-count", "1");
        });

        it("injects the table of contents tracking callbacks built from trackingCategory", () => {
            render(<ReadingContentPage author="Fabrizio" trackingCategory="blog_post" />);
            expect(screen.getByTestId("reading-content-page-template")).toHaveAttribute(
                "data-has-table-of-contents-tracking",
                "true",
            );
        });
    });
});
