import { describe, it, expect, vi, beforeAll } from "vitest";
import userEvent from "@testing-library/user-event";
import { render, screen, nextImageMock, nextLinkMock } from "@/test-utils";
import { MangaBrowser } from "./index";
import type { Content } from "@/types/content/content";
import { MangaStatus, type MangaMetadata } from "@/types/content/manga";

vi.mock("next/image", () => nextImageMock());
vi.mock("next/link", () => nextLinkMock());

class IntersectingObserver {
    constructor(private readonly callback: IntersectionObserverCallback) {}
    observe(target: Element) {
        this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as never);
    }
    unobserve() {}
    disconnect() {}
}

const mangaOf = (title: string, slug: string, volumes: number, volumesOwned: number): Content<MangaMetadata> => ({
    slug: { params: {}, formatted: slug },
    frontmatter: {
        title,
        description: `${title} description`,
        tags: [],
        authors: [],
        date: { year: 2026, month: 9, day: 28, formatted: "2026-09-28" },
        image: `${slug}/cover.jpg`,
        metadata: {
            storyBy: ["Author"],
            artBy: ["Artist"],
            originalPublisher: "Shueisha",
            magazine: "Weekly Shonen Jump",
            serializationStartYear: "2016",
            demographic: "Shonen",
            genres: ["Action"],
            status: MangaStatus.Completed,
            edition: "Standard Edition",
            editionPublisher: "Star Comics",
            language: "Italian",
            volumes,
            volumesOwned,
            acquiredYear: "2026",
            gallery: [],
        },
    },
    readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    contentFileRelativePath: "",
    content: "",
});

const mangas = [
    mangaOf("Death Note Complete Edition", "/manga/death-note", 1, 1),
    mangaOf("Demon Slayer: Kimetsu no Yaiba", "/manga/demon-slayer", 23, 5),
];

describe("MangaBrowser", () => {
    beforeAll(() => {
        vi.stubGlobal("IntersectionObserver", IntersectingObserver);
    });

    describe("render", () => {
        it("renders one card per Manga linking to its page", () => {
            render(<MangaBrowser mangas={mangas} />);
            const links = screen.getAllByRole("link");
            expect(links.map((link) => link.getAttribute("href"))).toEqual([
                "/manga/death-note",
                "/manga/demon-slayer",
            ]);
        });

        it("shows owned over total on each card, with a check mark only when complete", () => {
            render(<MangaBrowser mangas={mangas} />);
            expect(screen.getByText("1/1 ✓")).toBeInTheDocument();
            expect(screen.getByText("5/23")).toBeInTheDocument();
        });
    });

    describe("filter", () => {
        it("keeps only the Manga whose title matches, ignoring case", async () => {
            const user = userEvent.setup();
            render(<MangaBrowser mangas={mangas} />);

            await user.type(screen.getByRole("textbox", { name: "Search manga..." }), "DEMON");

            const links = screen.getAllByRole("link");
            expect(links).toHaveLength(1);
            expect(links[0]).toHaveAttribute("href", "/manga/demon-slayer");
        });

        it("shows the empty state naming the query when nothing matches", async () => {
            const user = userEvent.setup();
            render(<MangaBrowser mangas={mangas} />);

            await user.type(screen.getByRole("textbox", { name: "Search manga..." }), "naruto");

            expect(screen.getByText(/No manga found for/)).toHaveTextContent("naruto");
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });
    });
});
