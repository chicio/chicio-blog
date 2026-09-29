import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { trackWith } from "@/lib/tracking/tracking";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { ContentPage } from "./content-page";

const flattenMenuLinks = (entries: MenuEntry[]) =>
    entries.flatMap((entry) => ("groups" in entry ? entry.groups.flatMap((group) => group.items) : [entry]));

vi.mock("@/components/features/content/content-page-template", () => ({
    ContentPageTemplate: ({
        children,
        menuEntries,
        footerLinks,
        contactHref,
        onPaletteTrigger,
    }: {
        children?: React.ReactNode;
        menuEntries: MenuEntry[];
        footerLinks: { label: string; onClick?: () => void }[];
        contactHref: string;
        onPaletteTrigger: () => void;
    }) => (
        <div data-testid="content-page-template" data-contact-href={contactHref}>
            <button onClick={onPaletteTrigger}>palette</button>
            {flattenMenuLinks(menuEntries).map((link) => (
                <button key={`menu-${link.label}`} onClick={link.onClick}>
                    {`menu ${link.label}`}
                </button>
            ))}
            {footerLinks.map((link) => (
                <button key={`footer-${link.label}`} onClick={link.onClick}>
                    {`footer ${link.label}`}
                </button>
            ))}
            {children}
        </div>
    ),
}));

vi.mock("@/components/features/easter-eggs/the-choice", () => ({
    TheChoiceEasterEgg: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("ContentPage", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
    });

    describe("render", () => {
        it("renders the content page template", () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            expect(screen.getByTestId("content-page-template")).toBeInTheDocument();
        });

        it("points the footer contact call to action at the contact page", () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            expect(screen.getByTestId("content-page-template")).toHaveAttribute("data-contact-href", slugs.contact);
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

    describe("tracking", () => {
        it("tracks a menu link click under the page category and the header label", async () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "menu Manga" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_manga_collection,
            });
        });

        it("tracks a footer link click", async () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "footer Blog" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_blog,
            });
        });

        it("tracks the command palette trigger", async () => {
            render(<ContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "palette" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.command_palette_open,
            });
        });
    });
});
