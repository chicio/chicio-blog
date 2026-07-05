import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import type { Content } from "@/types/content/content";

const { mockExistsSync, mockReadFileSync, mockWriteFileSync } = vi.hoisted(() => ({
    mockExistsSync: vi.fn(),
    mockReadFileSync: vi.fn(),
    mockWriteFileSync: vi.fn(),
}));

vi.mock("fs", () => ({
    default: {
        existsSync: mockExistsSync,
        readFileSync: mockReadFileSync,
        writeFileSync: mockWriteFileSync,
    },
}));

const { mockGetIndexableContent } = vi.hoisted(() => ({
    mockGetIndexableContent: vi.fn(),
}));

vi.mock("./indexable-content", () => ({
    getIndexableContent: mockGetIndexableContent,
}));

const { mockCreateSearchIndex } = vi.hoisted(() => ({
    mockCreateSearchIndex: vi.fn(),
}));

vi.mock("./search-index-factory", () => ({
    createSearchIndex: mockCreateSearchIndex,
}));

import { generateAndSaveSearchIndex } from "./search";

const makeContent = (overrides: Partial<Content> = {}): Content => ({
    slug: { formatted: "/blog/post/2024/01/01/test-post", params: {} },
    frontmatter: {
        title: "Test Post",
        description: "A test post about React",
        tags: ["react", "typescript"],
        authors: [{ id: "fabrizio_duroni", name: "Fabrizio Duroni", linkedinUrl: "https://example.com", image: "/img.jpg", imageLarge: "/img-large.jpg" }],
        date: { year: 2024, month: 1, day: 1, formatted: "2024-01-01" },
        image: "/post-image.jpg",
    },
    readingTime: { text: "5 min read", minutes: 5, time: 300000, words: 1000 },
    contentFileRelativePath: "src/content/blog/2024/01/01/test-post/content.mdx",
    content: "Full content of the post",
    ...overrides,
});

describe("generateAndSaveSearchIndex", () => {
    let exitSpy: ReturnType<typeof vi.spyOn>;
    let warnSpy: ReturnType<typeof vi.spyOn>;
    let errorSpy: ReturnType<typeof vi.spyOn>;

    beforeEach(() => {
        vi.clearAllMocks();
        exitSpy = vi.spyOn(process, "exit").mockImplementation((() => undefined) as never);
        warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
        errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
        vi.spyOn(console, "log").mockImplementation(() => undefined);
        mockGetIndexableContent.mockReturnValue([makeContent()]);
        mockCreateSearchIndex.mockReturnValue({ documentStore: {} });
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("first run (no cache file)", () => {
        it("generates and writes the index and saves a new cache hash", () => {
            mockExistsSync.mockReturnValue(false);

            generateAndSaveSearchIndex();

            expect(mockCreateSearchIndex).toHaveBeenCalledTimes(1);
            expect(mockWriteFileSync).toHaveBeenCalledTimes(2);

            const [indexCall, cacheCall] = mockWriteFileSync.mock.calls;
            expect(indexCall[0]).toContain("public");
            expect(indexCall[1]).toBe(JSON.stringify({ documentStore: {} }));
            expect(indexCall[2]).toBe("utf8");

            expect(cacheCall[0]).toContain(".search-index-cache");
            expect(cacheCall[1]).toMatch(/^[a-f0-9]{64}$/);
            expect(cacheCall[2]).toBe("utf8");

            expect(exitSpy).not.toHaveBeenCalled();
        });
    });

    describe("cache miss (stale content)", () => {
        it("regenerates the index when the cached hash does not match the current content hash", () => {
            mockExistsSync.mockReturnValue(false);
            mockGetIndexableContent.mockReturnValue([makeContent()]);
            generateAndSaveSearchIndex();
            const [, firstCacheCall] = mockWriteFileSync.mock.calls;
            const previousHash = firstCacheCall[1] as string;

            mockCreateSearchIndex.mockClear();
            mockWriteFileSync.mockClear();
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(`${previousHash}\n`);
            mockGetIndexableContent.mockReturnValue([
                makeContent({ frontmatter: { ...makeContent().frontmatter, title: "A Totally Different Title" } }),
            ]);

            generateAndSaveSearchIndex();

            expect(mockCreateSearchIndex).toHaveBeenCalledTimes(1);
            expect(mockWriteFileSync).toHaveBeenCalledTimes(2);
            expect(exitSpy).not.toHaveBeenCalled();
        });
    });

    describe("cache hit", () => {
        it("skips regeneration when the cached hash matches the current content hash", () => {
            mockExistsSync.mockReturnValue(false);
            const sharedContent = [makeContent()];
            mockGetIndexableContent.mockReturnValue(sharedContent);
            generateAndSaveSearchIndex();
            const [, firstCacheCall] = mockWriteFileSync.mock.calls;
            const cachedHash = firstCacheCall[1] as string;

            mockCreateSearchIndex.mockClear();
            mockWriteFileSync.mockClear();
            mockExistsSync.mockReturnValue(true);
            mockReadFileSync.mockReturnValue(`${cachedHash}\n`);
            mockGetIndexableContent.mockReturnValue(sharedContent);

            generateAndSaveSearchIndex();

            expect(mockCreateSearchIndex).not.toHaveBeenCalled();
            expect(mockWriteFileSync).not.toHaveBeenCalled();
            expect(exitSpy).not.toHaveBeenCalled();
        });
    });

    describe("getCachedHash fail-open", () => {
        it("warns and treats the cache as missing when reading the cache file throws", () => {
            mockExistsSync.mockImplementation(() => {
                throw new Error("permission denied");
            });

            generateAndSaveSearchIndex();

            expect(warnSpy).toHaveBeenCalledWith("⚠️  Could not read cache file:", expect.any(Error));
            expect(mockCreateSearchIndex).toHaveBeenCalledTimes(1);
            expect(mockWriteFileSync).toHaveBeenCalledTimes(2);
            expect(exitSpy).not.toHaveBeenCalled();
        });
    });

    describe("saveCachedHash fail-open", () => {
        it("warns but does not crash when writing the cache file throws", () => {
            mockExistsSync.mockReturnValue(false);
            mockWriteFileSync.mockImplementation((filePath: string) => {
                if (filePath.toString().includes(".search-index-cache")) {
                    throw new Error("disk full");
                }
            });

            generateAndSaveSearchIndex();

            expect(warnSpy).toHaveBeenCalledWith("⚠️  Could not write cache file:", expect.any(Error));
            expect(mockCreateSearchIndex).toHaveBeenCalledTimes(1);
            expect(exitSpy).not.toHaveBeenCalled();
        });
    });

    describe("top-level error handling", () => {
        it("logs the error and exits with code 1 when getIndexableContent throws", () => {
            const failure = new Error("content loading failed");
            mockGetIndexableContent.mockImplementation(() => {
                throw failure;
            });

            generateAndSaveSearchIndex();

            expect(errorSpy).toHaveBeenCalledWith("Error generating search index:", failure);
            expect(exitSpy).toHaveBeenCalledWith(1);
            expect(mockCreateSearchIndex).not.toHaveBeenCalled();
        });

        it("logs the error and exits with code 1 when createSearchIndex throws", () => {
            const failure = new Error("index creation failed");
            mockExistsSync.mockReturnValue(false);
            mockCreateSearchIndex.mockImplementation(() => {
                throw failure;
            });

            generateAndSaveSearchIndex();

            expect(errorSpy).toHaveBeenCalledWith("Error generating search index:", failure);
            expect(exitSpy).toHaveBeenCalledWith(1);
            expect(mockWriteFileSync).not.toHaveBeenCalled();
        });

        it("logs the error and exits with code 1 when writing the index file throws", () => {
            const failure = new Error("write failed");
            mockExistsSync.mockReturnValue(false);
            mockWriteFileSync.mockImplementation(() => {
                throw failure;
            });

            generateAndSaveSearchIndex();

            expect(errorSpy).toHaveBeenCalledWith("Error generating search index:", failure);
            expect(exitSpy).toHaveBeenCalledWith(1);
        });
    });
});
