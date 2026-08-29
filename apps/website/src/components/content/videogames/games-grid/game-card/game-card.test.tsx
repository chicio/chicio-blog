import { describe, it, expect, vi } from "vitest";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { GameCard } from "./index";
import type { Content } from "@/types/content/content";
import { GameFormat, type GameMetadata } from "@/types/content/videogames";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

vi.mock("@/components/design-system/hooks/use-in-view-list", () => ({
    useInViewList: () => [vi.fn(), true],
}));

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
});
