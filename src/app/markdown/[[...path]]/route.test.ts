import { describe, it, expect, vi } from "vitest";

const {
    mockHomepageMarkdown,
    mockBlogListingMarkdown,
    mockBlogPostMarkdown,
    mockAboutMeMarkdown,
    mockDsaMarkdown,
    mockDsaRoadmapMarkdown,
    mockDsaExercisesListMarkdown,
    mockDsaTopicMarkdown,
    mockDsaExerciseMarkdown,
    mockVideogamesMarkdown,
    mockConsoleMarkdown,
    mockGameMarkdown,
    mockBlogStatsMarkdown,
    mockEasterEggHuntMarkdown,
} = vi.hoisted(() => ({
    mockHomepageMarkdown: vi.fn(),
    mockBlogListingMarkdown: vi.fn(),
    mockBlogPostMarkdown: vi.fn(),
    mockAboutMeMarkdown: vi.fn(),
    mockDsaMarkdown: vi.fn(),
    mockDsaRoadmapMarkdown: vi.fn(),
    mockDsaExercisesListMarkdown: vi.fn(),
    mockDsaTopicMarkdown: vi.fn(),
    mockDsaExerciseMarkdown: vi.fn(),
    mockVideogamesMarkdown: vi.fn(),
    mockConsoleMarkdown: vi.fn(),
    mockGameMarkdown: vi.fn(),
    mockBlogStatsMarkdown: vi.fn(),
    mockEasterEggHuntMarkdown: vi.fn(),
}));

vi.mock("@/lib/content/posts/posts-markdown", () => ({
    homepageMarkdown: mockHomepageMarkdown,
    blogListingMarkdown: mockBlogListingMarkdown,
    blogPostMarkdown: mockBlogPostMarkdown,
}));

vi.mock("@/lib/content/about-me/about-me-markdown", () => ({
    aboutMeMarkdown: mockAboutMeMarkdown,
}));

vi.mock("@/lib/content/easter-eggs/easter-egg-hunt-markdown", () => ({
    easterEggHuntMarkdown: mockEasterEggHuntMarkdown,
}));

vi.mock("@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms-markdown", () => ({
    dsaMarkdown: mockDsaMarkdown,
    dsaRoadmapMarkdown: mockDsaRoadmapMarkdown,
    dsaExercisesListMarkdown: mockDsaExercisesListMarkdown,
    dsaTopicMarkdown: mockDsaTopicMarkdown,
    dsaExerciseMarkdown: mockDsaExerciseMarkdown,
}));

vi.mock("@/lib/content/videogames/videogames-markdown", () => ({
    videogamesMarkdown: mockVideogamesMarkdown,
    consoleMarkdown: mockConsoleMarkdown,
    gameMarkdown: mockGameMarkdown,
}));

vi.mock("@/lib/blog-stats/blog-stats-markdown", () => ({
    blogStatsMarkdown: mockBlogStatsMarkdown,
}));

vi.mock("@/lib/content/posts/posts", () => ({
    getPosts: vi.fn().mockReturnValue([]),
}));

vi.mock("@/lib/content/data-structures-and-algorithms/data-structures-and-algorithms", () => ({
    getAllDataStructuresAndAlgorithmsTopics: vi.fn().mockReturnValue([]),
    getAllExercises: vi.fn().mockReturnValue([]),
}));

vi.mock("@/lib/content/videogames/videogames", () => ({
    getAllConsoles: vi.fn().mockReturnValue([]),
    getAllGames: vi.fn().mockReturnValue([]),
}));

vi.mock("next/navigation", () => ({
    notFound: vi.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
}));

import { GET } from "./route";

function makeContext(path: string[] | undefined): { params: Promise<{ path?: string[] }> } {
    return { params: Promise.resolve({ path }) };
}

describe("GET /markdown/[[...path]]", () => {
    describe("homepage (/)", () => {
        it("delegates to homepageMarkdown and returns text/markdown", async () => {
            mockHomepageMarkdown.mockReturnValue("# Home");
            const response = await GET(new Request("https://x.com/markdown"), makeContext(undefined));
            expect(response.status).toBe(200);
            expect(response.headers.get("Content-Type")).toContain("text/markdown");
            expect(await response.text()).toBe("# Home");
        });
    });

    describe("blog listing (/blog)", () => {
        it("delegates to blogListingMarkdown", async () => {
            mockBlogListingMarkdown.mockReturnValue("# Blog");
            const response = await GET(new Request("https://x.com/markdown/blog"), makeContext(["blog"]));
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Blog");
        });
    });

    describe("blog stats (/blog/stats)", () => {
        it("delegates to blogStatsMarkdown", async () => {
            mockBlogStatsMarkdown.mockReturnValue("# Blog Stats");
            const response = await GET(
                new Request("https://x.com/markdown/blog/stats"),
                makeContext(["blog", "stats"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Blog Stats");
        });
    });

    describe("about-me (/about-me)", () => {
        it("delegates to aboutMeMarkdown", async () => {
            mockAboutMeMarkdown.mockReturnValue("# About Me");
            const response = await GET(
                new Request("https://x.com/markdown/about-me"),
                makeContext(["about-me"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# About Me");
        });
    });

    describe("easter egg hunt (/easter-egg-hunt)", () => {
        it("delegates to easterEggHuntMarkdown", async () => {
            mockEasterEggHuntMarkdown.mockReturnValue("# Easter Egg Hunt");
            const response = await GET(
                new Request("https://x.com/markdown/easter-egg-hunt"),
                makeContext(["easter-egg-hunt"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Easter Egg Hunt");
        });
    });

    describe("DSA home (/data-structures-and-algorithms)", () => {
        it("delegates to dsaMarkdown", async () => {
            mockDsaMarkdown.mockReturnValue("# DSA");
            const response = await GET(
                new Request("https://x.com/markdown/dsa"),
                makeContext(["data-structures-and-algorithms"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# DSA");
        });
    });

    describe("DSA roadmap", () => {
        it("delegates to dsaRoadmapMarkdown", async () => {
            mockDsaRoadmapMarkdown.mockReturnValue("# Roadmap");
            const response = await GET(
                new Request("https://x.com/markdown/dsa/roadmap"),
                makeContext(["data-structures-and-algorithms", "roadmap"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Roadmap");
        });
    });

    describe("DSA exercises list", () => {
        it("delegates to dsaExercisesListMarkdown", async () => {
            mockDsaExercisesListMarkdown.mockReturnValue("# Exercises");
            const response = await GET(
                new Request("https://x.com/markdown/dsa/exercises"),
                makeContext(["data-structures-and-algorithms", "exercises"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Exercises");
        });
    });

    describe("videogames home (/videogames)", () => {
        it("delegates to videogamesMarkdown", async () => {
            mockVideogamesMarkdown.mockReturnValue("# Videogames");
            const response = await GET(
                new Request("https://x.com/markdown/videogames"),
                makeContext(["videogames"]),
            );
            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Videogames");
        });
    });

    describe("blog post (/blog/post/YYYY/MM/DD/slug)", () => {
        it("delegates to blogPostMarkdown with correct params", async () => {
            mockBlogPostMarkdown.mockReturnValue("# My Post");
            const response = await GET(
                new Request("https://x.com/markdown/blog/post/2024/01/01/my-post"),
                makeContext(["blog", "post", "2024", "01", "01", "my-post"]),
            );
            expect(response.status).toBe(200);
            expect(mockBlogPostMarkdown).toHaveBeenCalledWith({
                year: "2024",
                month: "01",
                day: "01",
                slug: "my-post",
            });
        });

        it("calls notFound when blogPostMarkdown returns null", async () => {
            mockBlogPostMarkdown.mockReturnValue(null);
            await expect(
                GET(
                    new Request("https://x.com/markdown/blog/post/2024/01/01/missing"),
                    makeContext(["blog", "post", "2024", "01", "01", "missing"]),
                ),
            ).rejects.toThrow("NEXT_NOT_FOUND");
        });
    });

    describe("DSA topic (/data-structures-and-algorithms/topic/[topic])", () => {
        it("delegates to dsaTopicMarkdown", async () => {
            mockDsaTopicMarkdown.mockReturnValue("# Binary Search");
            const response = await GET(
                new Request("https://x.com/markdown/dsa/topic/binary-search"),
                makeContext(["data-structures-and-algorithms", "topic", "binary-search"]),
            );
            expect(response.status).toBe(200);
            expect(mockDsaTopicMarkdown).toHaveBeenCalledWith({ topic: "binary-search" });
        });
    });

    describe("DSA exercise", () => {
        it("delegates to dsaExerciseMarkdown with topic and exercise", async () => {
            mockDsaExerciseMarkdown.mockReturnValue("# Exercise 1");
            const response = await GET(
                new Request("https://x.com/markdown/dsa/topic/sorting/exercise/quick-sort"),
                makeContext([
                    "data-structures-and-algorithms",
                    "topic",
                    "sorting",
                    "exercise",
                    "quick-sort",
                ]),
            );
            expect(response.status).toBe(200);
            expect(mockDsaExerciseMarkdown).toHaveBeenCalledWith({
                topic: "sorting",
                exercise: "quick-sort",
            });
        });
    });

    describe("videogame console", () => {
        it("delegates to consoleMarkdown", async () => {
            mockConsoleMarkdown.mockReturnValue("# SNES");
            const response = await GET(
                new Request("https://x.com/markdown/videogames/console/snes"),
                makeContext(["videogames", "console", "snes"]),
            );
            expect(response.status).toBe(200);
            expect(mockConsoleMarkdown).toHaveBeenCalledWith({ console: "snes" });
        });
    });

    describe("videogame game", () => {
        it("delegates to gameMarkdown", async () => {
            mockGameMarkdown.mockReturnValue("# Zelda");
            const response = await GET(
                new Request("https://x.com/markdown/videogames/console/snes/game/zelda"),
                makeContext(["videogames", "console", "snes", "game", "zelda"]),
            );
            expect(response.status).toBe(200);
            expect(mockGameMarkdown).toHaveBeenCalledWith({ console: "snes", game: "zelda" });
        });
    });

    describe("unknown path", () => {
        it("calls notFound for an unrecognized path", async () => {
            await expect(
                GET(
                    new Request("https://x.com/markdown/unknown/path"),
                    makeContext(["unknown", "path"]),
                ),
            ).rejects.toThrow("NEXT_NOT_FOUND");
        });
    });

    describe("response headers", () => {
        it("includes x-markdown-tokens header", async () => {
            mockHomepageMarkdown.mockReturnValue("# Home page content");
            const response = await GET(new Request("https://x.com/markdown"), makeContext(undefined));
            expect(response.headers.get("x-markdown-tokens")).toBeDefined();
        });

        it("includes Cache-Control header", async () => {
            mockHomepageMarkdown.mockReturnValue("# Home");
            const response = await GET(new Request("https://x.com/markdown"), makeContext(undefined));
            expect(response.headers.get("Cache-Control")).toContain("max-age=3600");
        });
    });
});
