import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { SiteMenu } from "./site-menu";

const flattenMenuLinks = (entries: MenuEntry[]) =>
    entries.flatMap((entry) => ("groups" in entry ? entry.groups.flatMap((group) => group.items) : [entry]));

vi.mock("@/components/features/design-system-next/menu", () => ({
    Menu: ({ entries }: { entries: MenuEntry[] }) => (
        <nav>
            {flattenMenuLinks(entries).map((link) => (
                <button key={link.label} onClick={link.onClick}>
                    {link.label}
                </button>
            ))}
        </nav>
    ),
}));

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("SiteMenu", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
    });

    describe("render", () => {
        it("renders the site menu links, Manga included", () => {
            render(<SiteMenu trackingCategory="test" />);
            expect(screen.getByRole("button", { name: "Manga" })).toBeInTheDocument();
        });
    });

    describe("tracking", () => {
        it("tracks a menu link click under the given category and the header label", async () => {
            render(<SiteMenu trackingCategory="test" />);
            await userEvent.click(screen.getByRole("button", { name: "Manga" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: "test",
                label: tracking.label.header,
                action: tracking.action.open_manga_collection,
            });
        });

        it("tracks every link, not only the first", async () => {
            render(<SiteMenu trackingCategory="test" />);
            await userEvent.click(screen.getByRole("button", { name: "Home" }));
            await userEvent.click(screen.getByRole("button", { name: "Chat" }));
            expect(vi.mocked(trackWith).mock.calls.map(([payload]) => payload.action)).toEqual([
                tracking.action.open_home,
                tracking.action.open_chat,
            ]);
        });
    });
});
