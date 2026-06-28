import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { ContentPage } from "./content-page";

vi.mock("@/components/design-system/templates/content-page-template", () => ({
    ContentPageTemplate: ({
        children,
        navHrefs,
        footerNavHrefs,
        socialLinks,
        headerWrapper: _hw,
        ...rest
    }: Record<string, unknown> & { children?: React.ReactNode }) => (
        <div data-testid="content-page-template" data-has-nav-hrefs={!!navHrefs} {...(rest as object)}>
            {children}
        </div>
    ),
}));

vi.mock("@/components/features/easter-eggs/dejavu", () => ({
    DejavuEasterEgg: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("ContentPage", () => {
    describe("render", () => {
        it("renders the content page template", () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            expect(screen.getByTestId("content-page-template")).toBeInTheDocument();
        });

        it("passes nav hrefs to the template", () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            expect(screen.getByTestId("content-page-template")).toHaveAttribute(
                "data-has-nav-hrefs",
                "true",
            );
        });

        it("renders children", () => {
            render(
                <ContentPage trackingCategory="test" author="Fabrizio">
                    <p>page body</p>
                </ContentPage>,
            );
            expect(screen.getByText("page body")).toBeInTheDocument();
        });
    });
});
