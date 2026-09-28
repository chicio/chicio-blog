import { describe, it, expect, vi, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@/test-utils";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";
import type { MenuEntry } from "@/components/features/design-system-next/menu";
import { Chat } from "./chat";

const flattenMenuLinks = (entries: MenuEntry[]) =>
    entries.flatMap((entry) => ("groups" in entry ? entry.groups.flatMap((group) => group.items) : [entry]));

vi.mock("@ai-sdk/react", () => ({
    useChat: () => ({ messages: [], sendMessage: vi.fn(), error: undefined }),
}));

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

vi.mock("@/components/features/design-system-next/brand-header", () => ({ BrandHeader: () => null }));
vi.mock("./chat-input", () => ({ ChatInput: () => null }));
vi.mock("./chat-welcome", () => ({ ChatWelcome: () => null }));
vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

describe("Chat", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
    });

    describe("render", () => {
        it("renders the menu with the Manga hobby entry", () => {
            render(<Chat />);
            expect(screen.getByRole("button", { name: "Manga" })).toBeInTheDocument();
        });
    });

    describe("tracking", () => {
        it("tracks a menu click under the chat category and the header label", async () => {
            render(<Chat />);
            await userEvent.click(screen.getByRole("button", { name: "Manga" }));
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.chat,
                label: tracking.label.header,
                action: tracking.action.open_manga_collection,
            });
        });
    });
});
