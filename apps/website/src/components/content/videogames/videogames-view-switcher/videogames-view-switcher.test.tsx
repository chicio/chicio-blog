import { describe, it, expect, vi } from "vitest";
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
            gallery: [],
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
                gallery: ["/media/console.jpg"],
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
});
