import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { Homepage } from "./homepage";

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

vi.mock("matrix-design-system", async (importOriginal) => ({
    ...(await importOriginal<typeof import("matrix-design-system")>()),
    MatrixBackground: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("./profile-presentation", () => ({ ProfilePresentation: () => <div>profile</div> }));
vi.mock("@/components/features/seo/jsond-ld", () => ({ JsonLd: () => null }));
vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("Homepage", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
    });

    describe("render", () => {
        it("renders the menu with the Manga hobby entry", () => {
            render(<Homepage />);
            expect(screen.getByRole("button", { name: "Manga" })).toBeInTheDocument();
        });
    });

    describe("tracking", () => {
        it("tracks a menu click under the home category and the header label", async () => {
            render(<Homepage />);
            await userEvent.click(screen.getByRole("button", { name: "Manga" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.home,
                label: tracking.label.header,
                action: tracking.action.open_manga_collection,
            });
        });
    });
});
