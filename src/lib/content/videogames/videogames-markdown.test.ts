import { describe, it, expect, vi } from "vitest";

const {
    mockListConsoles,
    mockListGames,
    mockSingleConsole,
    mockSingleGame,
    mockSingleVideogamesHome,
    mockGetAllGamesForConsole,
} = vi.hoisted(() => ({
    mockListConsoles: vi.fn(),
    mockListGames: vi.fn(),
    mockSingleConsole: vi.fn(),
    mockSingleGame: vi.fn(),
    mockSingleVideogamesHome: vi.fn(),
    mockGetAllGamesForConsole: vi.fn(),
}));

vi.mock("@/lib/content/videogames/videogames", () => ({
    consoles: { list: mockListConsoles, single: mockSingleConsole },
    games: { list: mockListGames, single: mockSingleGame },
    videogamesHome: { single: mockSingleVideogamesHome },
    getAllGamesForConsole: mockGetAllGamesForConsole,
}));

import { consoleMarkdown, gameMarkdown, videogamesMarkdown } from "./videogames-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

const consoleContent = {
    frontmatter: {
        title: "Game Boy",
        description: "Nintendo's handheld console",
        metadata: { manufacturer: "Nintendo", releaseYear: "1989", generation: "4th", name: "gameboy" },
    },
    slug: { formatted: `${slugs.videogames.home}/console/gameboy` },
    content: "Console body.",
    headings: [],
};

const gameContent = {
    frontmatter: {
        title: "Tetris",
        description: "The classic puzzle game",
        metadata: {
            console: "Game Boy",
            developer: "Nintendo",
            publisher: "Nintendo",
            genre: "Puzzle",
            releaseYear: "1989",
            region: "PAL",
        },
    },
    slug: { formatted: `${slugs.videogames.home}/console/gameboy/game/tetris` },
    content: "Game body.",
    headings: [],
};

describe("videogames-markdown", () => {
    describe("videogamesMarkdown", () => {
        it("renders the canonical header with consoles and games sections", () => {
            mockListConsoles.mockReturnValue([consoleContent]);
            mockListGames.mockReturnValue([gameContent]);
            mockSingleVideogamesHome.mockReturnValue({
                frontmatter: { title: "My Videogames Collection", description: "The collection" },
                slug: { formatted: slugs.videogames.home, params: {} },
                content: "Collection intro.",
                headings: [],
            });

            const result = videogamesMarkdown({});

            expect(result).toContain("# My Videogames Collection");
            expect(result).toContain("Collection intro.");
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}${slugs.videogames.home}`);
            expect(result).toContain("## Consoles (1)");
            expect(result).toContain("## Games (1)");
            expect(result).toContain("[Game Boy]");
            expect(result).toContain("[Tetris]");
        });
    });

    describe("consoleMarkdown", () => {
        it("returns null for an unknown console", () => {
            mockSingleConsole.mockReturnValue(undefined);

            expect(consoleMarkdown({ console: "unknown" })).toBeNull();
        });

        it("folds manufacturer/release year/generation into the body", () => {
            mockSingleConsole.mockReturnValue(consoleContent);
            mockGetAllGamesForConsole.mockReturnValue([gameContent]);

            const result = consoleMarkdown({ console: "gameboy" });

            expect(result).toContain("# Game Boy");
            expect(result).toContain("**Manufacturer:** Nintendo");
            expect(result).toContain("**Release Year:** 1989");
            expect(result).toContain("**Generation:** 4th");
            expect(result).toContain("Console body.");
            expect(result).toContain("## Games (1)");
            expect(result).toContain("[Tetris]");
        });
    });

    describe("gameMarkdown", () => {
        it("returns null for an unknown game", () => {
            mockSingleGame.mockReturnValue(undefined);

            expect(gameMarkdown({ console: "gameboy", game: "unknown" })).toBeNull();
        });

        it("folds console/developer/publisher/genre/release year/region into the body", () => {
            mockSingleGame.mockReturnValue(gameContent);

            const result = gameMarkdown({ console: "gameboy", game: "tetris" });

            expect(result).toContain("# Tetris");
            expect(result).toContain("**Console:** Game Boy");
            expect(result).toContain("**Developer:** Nintendo");
            expect(result).toContain("**Publisher:** Nintendo");
            expect(result).toContain("**Genre:** Puzzle");
            expect(result).toContain("**Release Year:** 1989");
            expect(result).toContain("**Region:** PAL");
            expect(result).toContain("Game body.");
        });
    });
});
