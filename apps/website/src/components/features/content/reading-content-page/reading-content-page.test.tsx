import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { trackWith } from "@/lib/tracking/tracking";
import { slugs } from "@/types/configuration/slug";
import { tracking } from "@/types/configuration/tracking";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { ReadingContentPage } from "./reading-content-page";

const flattenMenuLinks = (entries: MenuEntry[]) =>
    entries.flatMap((entry) => ("groups" in entry ? entry.groups.flatMap((group) => group.items) : [entry]));

vi.mock("@/components/features/content/reading-content-page-template", () => ({
    ReadingContentPageTemplate: ({
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
        <div data-testid="reading-content-page-template" data-contact-href={contactHref}>
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

describe("ReadingContentPage", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
    });

    describe("render", () => {
        it("renders the reading content page template", () => {
            render(<ReadingContentPage author="Fabrizio" />);
            expect(screen.getByTestId("reading-content-page-template")).toBeInTheDocument();
        });

        it("points the footer contact call to action at the contact page", () => {
            render(<ReadingContentPage author="Fabrizio" />);
            expect(screen.getByTestId("reading-content-page-template")).toHaveAttribute(
                "data-contact-href",
                slugs.contact,
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

    describe("tracking", () => {
        it("tracks a menu link click under the page category and the header label", async () => {
            render(<ReadingContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "menu Manga" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_manga_collection,
            });
        });

        it("tracks the blog authors link that the reading pages used to miss", async () => {
            render(<ReadingContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "menu Authors" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_blog_authors,
            });
        });

        it("tracks a footer link click", async () => {
            render(<ReadingContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "footer Archive" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_blog_archive,
            });
        });

        it("tracks the command palette trigger", async () => {
            render(<ReadingContentPage trackingCategory="test" author="Fabrizio" />);
            await userEvent.click(screen.getByRole("button", { name: "palette" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.command_palette_open,
            });
        });
    });
});
