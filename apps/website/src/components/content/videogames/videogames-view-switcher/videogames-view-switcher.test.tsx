import { describe, it, expect, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { VideogamesViewSwitcher } from "./index";
import type { Content } from "@/types/content/content";
import { GameFormat, type GameMetadata, type ConsoleMetadata } from "@/types/content/videogames";
import type { ConsoleWithGameCount } from "./use-videogames-view-switcher-store";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

const makeGame = (title: string): Content<GameMetadata> => ({
    slug: { params: {}, formatted: `/videogames/nes/${title.toLowerCase()}` },
    frontmatter: {
        title,
        description: "",
        tags: [],
        authors: [],
        date: { year: 2020, month: 1, day: 1, formatted: "2020-01-01" },
        image: "/media/game.jpg",
        metadata: {
            formats: [GameFormat.Physical],
            releaseYear: "2020",
            acquiredYear: "2021",
            console: "NES",
            developer: "Dev",
            publisher: "Pub",
            genre: "Action",
            pegiRating: "3",
            region: "EU",
        },
    },
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    contentFileRelativePath: "",
    content: "",
});

const makeConsoleWithGameCount = (name: string, count: number): ConsoleWithGameCount => ({
    gamesCount: count,
    console: {
        slug: { params: {}, formatted: `/videogames/${name.toLowerCase()}` },
        frontmatter: {
            title: name,
            description: "",
            tags: [],
            authors: [],
            date: { year: 1985, month: 1, day: 1, formatted: "1985-01-01" },
            image: "/media/console.jpg",
            metadata: {
                name,
                logo: "",
                releaseYear: "1985",
                acquiredYear: "2020",
                bits: "8",
                generation: "3",
                manufacturer: "Nintendo",
                manufacturerLogo: "",
                sku: "NES-001",
            },
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    },
});

describe("VideogamesViewSwitcher", () => {
    describe("render", () => {
        it("renders the view toggle (By Console / All Games)", () => {
            render(
                <VideogamesViewSwitcher
                    games={[makeGame("Zelda")]}
                    consolesWithGameCount={[makeConsoleWithGameCount("NES", 1)]}
                />,
            );
            expect(screen.getByText("By Console")).toBeInTheDocument();
            expect(screen.getByText("All Games")).toBeInTheDocument();
        });

        it("shows each console card with its cover taken from the frontmatter image", () => {
            render(
                <VideogamesViewSwitcher
                    games={[makeGame("Zelda")]}
                    consolesWithGameCount={[makeConsoleWithGameCount("NES", 1)]}
                />,
            );

            const covers = screen.getAllByRole("img", { name: "NES" });

            expect(covers.length).toBeGreaterThan(0);
            covers.forEach((cover) => {
                expect(cover).toHaveAttribute("src", "/media/console.jpg");
            });
        });

        it("renders the filter input", () => {
            render(
                <VideogamesViewSwitcher
                    games={[makeGame("Zelda")]}
                    consolesWithGameCount={[makeConsoleWithGameCount("NES", 1)]}
                />,
            );
            expect(screen.getByRole("textbox")).toBeInTheDocument();
        });
    });

    describe("filtering", () => {
        it("tells no console matches the query in the consoles view", async () => {
            const user = userEvent.setup();
            render(
                <VideogamesViewSwitcher
                    games={[makeGame("Zelda")]}
                    consolesWithGameCount={[makeConsoleWithGameCount("NES", 1)]}
                />,
            );

            await user.type(screen.getByRole("textbox"), "zzz");

            expect(screen.getByText(/No consoles found for/)).toHaveTextContent(
                "No consoles found for \u201Czzz\u201D.",
            );
        });

        it("tells no game matches the query in the games view", async () => {
            const user = userEvent.setup();
            render(
                <VideogamesViewSwitcher
                    games={[makeGame("Zelda")]}
                    consolesWithGameCount={[makeConsoleWithGameCount("NES", 1)]}
                />,
            );

            await user.click(screen.getByText("All Games"));
            await user.type(screen.getByRole("textbox"), "zzz");

            expect(screen.getByText(/No games found for/)).toHaveTextContent("No games found for \u201Czzz\u201D.");
        });
    });
});
