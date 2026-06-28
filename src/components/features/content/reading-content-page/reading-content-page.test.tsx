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
        ...rest
    }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <div data-testid="reading-content-page-template" data-has-nav-hrefs={!!navHrefs} {...(rest as object)}>
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
    });
});
