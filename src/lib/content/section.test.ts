import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockGetAllContentFor, mockGetSingleContentBy } = vi.hoisted(() => ({
    mockGetAllContentFor: vi.fn(),
    mockGetSingleContentBy: vi.fn(),
}));

vi.mock("./content", () => ({
    getAllContentFor: mockGetAllContentFor,
    getSingleContentBy: mockGetSingleContentBy,
}));

import { createSection } from "./section";
import { Content } from "@/types/content/content";

type FakeMeta = { order: number };

const makeContent = (slugFormatted: string, order: number): Content<FakeMeta> =>
    ({
        slug: { formatted: slugFormatted, params: {} },
        frontmatter: {
            title: slugFormatted,
            description: "",
            tags: [],
            authors: [],
            date: { formatted: "2024-01-01", year: 2024, month: 1, day: 1 },
            image: "",
            metadata: { order },
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    }) as Content<FakeMeta>;

beforeEach(() => {
    vi.clearAllMocks();
});

describe("createSection", () => {
    describe("list", () => {
        it("returns the content unsorted when no comparator is configured", () => {
            const cached = [makeContent("/c", 3), makeContent("/a", 1), makeContent("/b", 2)];
            mockGetAllContentFor.mockReturnValue(cached);

            const section = createSection<FakeMeta>({ slug: "/slug" });

            expect(section.list().map((c) => c.slug.formatted)).toEqual(["/c", "/a", "/b"]);
        });

        it("never hands back the cached array itself, so callers cannot corrupt the build cache", () => {
            const cached = [makeContent("/c", 3), makeContent("/a", 1), makeContent("/b", 2)];
            mockGetAllContentFor.mockReturnValue(cached);

            const section = createSection<FakeMeta>({ slug: "/slug" });
            const listed = section.list();

            expect(listed).not.toBe(cached);

            listed.sort((a, b) => a.frontmatter.metadata!.order - b.frontmatter.metadata!.order);

            expect(cached.map((c) => c.slug.formatted)).toEqual(["/c", "/a", "/b"]);
        });

        it("sorts using the configured comparator", () => {
            const cached = [makeContent("/c", 3), makeContent("/a", 1), makeContent("/b", 2)];
            mockGetAllContentFor.mockReturnValue(cached);

            const section = createSection<FakeMeta>({
                slug: "/slug",
                sort: (a, b) => a.frontmatter.metadata!.order - b.frontmatter.metadata!.order,
            });

            expect(section.list().map((c) => c.slug.formatted)).toEqual(["/a", "/b", "/c"]);
        });

        it("does not mutate the cached array returned by getAllContentFor when sorting", () => {
            const cached = [makeContent("/c", 3), makeContent("/a", 1), makeContent("/b", 2)];
            mockGetAllContentFor.mockReturnValue(cached);

            const section = createSection<FakeMeta>({
                slug: "/slug",
                sort: (a, b) => a.frontmatter.metadata!.order - b.frontmatter.metadata!.order,
            });

            section.list();

            expect(cached.map((c) => c.slug.formatted)).toEqual(["/c", "/a", "/b"]);
        });

        it("works with loose (unknown) metadata when no generic type argument is given", () => {
            const cached = [makeContent("/a", 1)];
            mockGetAllContentFor.mockReturnValue(cached);

            const section = createSection({ slug: "/slug" });

            expect(section.list()).toHaveLength(1);
        });
    });

    describe("single", () => {
        it("resolves content by params via getSingleContentBy", () => {
            const content = makeContent("/a/1", 1);
            mockGetSingleContentBy.mockReturnValue(content);

            const section = createSection<FakeMeta>({ slug: "/slug/[id]" });

            expect(section.single({ id: "1" })).toBe(content);
            expect(mockGetSingleContentBy).toHaveBeenCalledWith("/slug/[id]", { id: "1" });
        });

        it("returns undefined when getSingleContentBy finds nothing", () => {
            mockGetSingleContentBy.mockReturnValue(undefined);

            const section = createSection<FakeMeta>({ slug: "/slug/[id]" });

            expect(section.single({ id: "missing" })).toBeUndefined();
        });

        it("passes undefined params through when none are given", () => {
            mockGetSingleContentBy.mockReturnValue(undefined);

            const section = createSection({ slug: "/slug" });
            section.single();

            expect(mockGetSingleContentBy).toHaveBeenCalledWith("/slug", undefined);
        });
    });
});
