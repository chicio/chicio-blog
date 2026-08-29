import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockPageMarkdown, mockCollectionMarkdown, mockEmptyMarkdown } = vi.hoisted(() => ({
    mockPageMarkdown: vi.fn(),
    mockCollectionMarkdown: vi.fn(),
    mockEmptyMarkdown: vi.fn(),
}));

/**
 * The route's own job is matching a path to a registry entry and turning its markdown into a response,
 * so it is tested against a small fake registry. That the real registry names the right generator for
 * each page is asserted in `registry.test.ts`, and the matching rules in `slug-template.test.ts`.
 */
vi.mock("@/lib/content/registry", () => ({
    contentRegistry: [
        { slug: "/", markdown: mockPageMarkdown },
        { slug: "/a-page", markdown: mockPageMarkdown },
        { slug: "/no-content", markdown: mockEmptyMarkdown },
        { slug: "/things/known", markdown: mockPageMarkdown },
        {
            slug: "/things/[thing]/part/[part]",
            params: () => [
                { thing: "first", part: "one" },
                { thing: "second", part: "two" },
            ],
            markdown: mockCollectionMarkdown,
        },
    ],
}));

vi.mock("next/navigation", () => ({
    notFound: vi.fn(() => {
        throw new Error("NEXT_NOT_FOUND");
    }),
}));

import { GET, generateStaticParams } from "./route";

const makeContext = (path: string[] | undefined): { params: Promise<{ path?: string[] }> } => ({
    params: Promise.resolve({ path }),
});

const get = (path: string[] | undefined) => GET(new Request("https://x.com/markdown"), makeContext(path));

beforeEach(() => {
    vi.clearAllMocks();
    mockPageMarkdown.mockReturnValue("# Page");
    mockCollectionMarkdown.mockReturnValue("# Item");
    mockEmptyMarkdown.mockReturnValue(null);
});

describe("markdown route", () => {
    describe("dispatch", () => {
        it("serves a single page entry", async () => {
            const response = await get(["a-page"]);

            expect(response.status).toBe(200);
            expect(await response.text()).toBe("# Page");
        });

        it("treats an absent path as the root entry", async () => {
            await get(undefined);

            expect(mockPageMarkdown).toHaveBeenCalledWith({});
        });

        it("passes the captured params to a collection entry", async () => {
            const response = await get(["things", "gameboy", "part", "tetris"]);

            expect(response.status).toBe(200);
            expect(mockCollectionMarkdown).toHaveBeenCalledWith({ thing: "gameboy", part: "tetris" });
        });

        it("prefers an exact page slug over a collection template of the same length", async () => {
            await get(["things", "known"]);

            expect(mockPageMarkdown).toHaveBeenCalled();
            expect(mockCollectionMarkdown).not.toHaveBeenCalled();
        });
    });

    describe("not found", () => {
        it("404s a path no entry matches", async () => {
            await expect(get(["nope", "nothing", "here"])).rejects.toThrow("NEXT_NOT_FOUND");
        });

        it("404s when the matched entry has no content for that path", async () => {
            await expect(get(["no-content"])).rejects.toThrow("NEXT_NOT_FOUND");
        });
    });

    describe("response", () => {
        it("is served as markdown", async () => {
            const response = await get(["a-page"]);

            expect(response.headers.get("Content-Type")).toBe("text/markdown; charset=utf-8");
        });

        it("estimates the token count for agents", async () => {
            mockPageMarkdown.mockReturnValue("12345678");

            const response = await get(["a-page"]);

            expect(response.headers.get("x-markdown-tokens")).toBe("2");
        });

        it("is cacheable", async () => {
            const response = await get(["a-page"]);

            expect(response.headers.get("Cache-Control")).toContain("max-age=3600");
        });
    });

    describe("generateStaticParams", () => {
        it("emits undefined rather than an empty array for the root, as Next requires", async () => {
            const params = await generateStaticParams();

            expect(params).toContainEqual({ path: undefined });
        });

        it("emits one entry per single page", async () => {
            const params = await generateStaticParams();

            expect(params).toContainEqual({ path: ["a-page"] });
            expect(params).toContainEqual({ path: ["things", "known"] });
        });

        it("expands a collection template once per param set", async () => {
            const params = await generateStaticParams();

            expect(params).toContainEqual({ path: ["things", "first", "part", "one"] });
            expect(params).toContainEqual({ path: ["things", "second", "part", "two"] });
        });

        it("emits nothing beyond the registry's entries", async () => {
            const params = await generateStaticParams();

            expect(params).toHaveLength(6);
        });
    });
});
