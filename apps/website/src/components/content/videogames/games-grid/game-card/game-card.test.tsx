import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { GameCard } from "./index";
import { writeVideogamesNavigationOrigin } from "@/lib/videogames/videogames-navigation-origin";
import type { Content } from "@/types/content/content";
import { GameFormat, type GameMetadata } from "@/types/content/videogames";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

vi.mock("@/lib/videogames/videogames-navigation-origin", () => ({
    writeVideogamesNavigationOrigin: vi.fn(),
}));

class IntersectingObserver {
    constructor(private readonly callback: IntersectionObserverCallback) {}
    observe(target: Element) {
        this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as never);
    }
    unobserve() {}
    disconnect() {}
}

const game: Content<GameMetadata> = {
    slug: { params: {}, formatted: "/videogames/nes/zelda" },
    frontmatter: {
        title: "The Legend of Zelda",
        description: "Classic NES action-adventure",
        tags: [],
        authors: [],
        date: { year: 1986, month: 2, day: 21, formatted: "1986-02-21" },
        image: "/media/games/zelda.jpg",
        metadata: {
            formats: [GameFormat.Physical],
            releaseYear: "1986",
            acquiredYear: "2020",
            console: "NES",
            developer: "Nintendo",
            publisher: "Nintendo",
            genre: "Action-Adventure",
            pegiRating: "3",
            region: "EU",
            gallery: [],
        },
    },
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    contentFileRelativePath: "",
    content: "",
};

describe("GameCard", () => {
    beforeAll(() => {
        vi.stubGlobal("IntersectionObserver", IntersectingObserver);
    });

    beforeEach(() => {
        vi.mocked(writeVideogamesNavigationOrigin).mockClear();
    });

    describe("render", () => {
        it("renders the card container", () => {
            const { container } = render(<GameCard game={game} />);
            expect(container.firstChild).toBeInTheDocument();
        });

        it("renders the game title when in view", () => {
            render(<GameCard game={game} />);
            expect(screen.getByText("The Legend of Zelda")).toBeInTheDocument();
        });

        it("renders a link to the game detail page", () => {
            render(<GameCard game={game} />);
            const links = screen.getAllByRole("link");
            const slugLinks = links.filter((l) => l.getAttribute("href") === "/videogames/nes/zelda");
            expect(slugLinks.length).toBeGreaterThan(0);
        });
    });

    describe("format badges", () => {
        it("renders one badge for each format the game is owned in", () => {
            const both: Content<GameMetadata> = {
                ...game,
                frontmatter: {
                    ...game.frontmatter,
                    metadata: { ...game.frontmatter.metadata!, formats: [GameFormat.Physical, GameFormat.Digital] },
                },
            };
            const { container } = render(<GameCard game={both} />);
            expect(container.querySelectorAll("span.glow-border")).toHaveLength(2);
        });
    });

    describe("navigation origin", () => {
        it("remembers the console origin by default when the card is opened", async () => {
            const user = userEvent.setup();
            render(<GameCard game={game} />);

            await user.click(screen.getByRole("link"));

            expect(writeVideogamesNavigationOrigin).toHaveBeenCalledWith("console");
        });

        it("remembers the origin it was given when the card is opened", async () => {
            const user = userEvent.setup();
            render(<GameCard game={game} navigationOrigin="all-games" />);

            await user.click(screen.getByRole("link"));

            expect(writeVideogamesNavigationOrigin).toHaveBeenCalledWith("all-games");
        });
    });
});
