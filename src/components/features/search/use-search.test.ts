import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act, RenderHookResult } from "@testing-library/react";
import { ChangeEvent } from "react";
import type { SearchResult } from "@/types/search/search";

const mockSearch = vi.fn(() => [{ ref: "post-1" }]);
const mockGetDoc = vi.fn(() => ({
    title: "Test Post",
    slug: "post-1",
    description: "desc",
    tags: [],
    authors: [],
}));

vi.mock("elasticlunr", () => ({
    default: {
        Index: {
            load: vi.fn(() => ({
                search: mockSearch,
                documentStore: { getDoc: mockGetDoc },
            })),
        },
    },
}));

import { useSearch } from "./use-search";

function getResultsFromSearchResult(result: SearchResult) {
    return result.results;
}

type UseSearchReturn = ReturnType<typeof useSearch>;

const renderLoadedSearch = async (
    searchIndexFileName = "search-index.json",
): Promise<RenderHookResult<UseSearchReturn, unknown>> => {
    let rendered!: RenderHookResult<UseSearchReturn, unknown>;
    await act(async () => {
        rendered = renderHook(() => useSearch(true, searchIndexFileName));
    });
    return rendered;
};

describe("useSearch", () => {
    beforeEach(() => {
        mockSearch.mockClear();
        mockGetDoc.mockClear();
        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            json: () => Promise.resolve({ index: "data" }),
        } as Response);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe("initial state", () => {
        it("returns empty search results initially", () => {
            const { result } = renderHook(() => useSearch(false, "search-index.json"));
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(0);
        });

        it("returns isPending false initially", () => {
            const { result } = renderHook(() => useSearch(false, "search-index.json"));
            expect(result.current.isPending).toBe(false);
        });
    });

    describe("when startSearch becomes true", () => {
        it("fetches the search index file", async () => {
            await act(async () => {
                renderHook(() => useSearch(true, "my-search-index.json"));
            });
            expect(fetch).toHaveBeenCalledWith("/my-search-index.json");
        });
    });

    describe("handleSearch", () => {
        it("does nothing when startSearch is false", async () => {
            const { result } = renderHook(() => useSearch(false, "search-index.json"));
            const event = { target: { value: "test query" } } as ChangeEvent<HTMLInputElement>;
            await act(async () => {
                result.current.handleSearch(event);
            });
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(0);
        });

        it("returns empty results when the query is below the 3-char minimum", async () => {
            const { result } = await renderLoadedSearch();

            const event = { target: { value: "ab" } } as ChangeEvent<HTMLInputElement>;
            await act(async () => {
                result.current.handleSearch(event);
            });

            expect(mockSearch).not.toHaveBeenCalled();
            expect(result.current.search.type).toBe("search");
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(0);
        });

        it("returns docs mapped from the search index when the query meets the minimum length", async () => {
            const { result } = await renderLoadedSearch();

            const event = { target: { value: "matrix" } } as ChangeEvent<HTMLInputElement>;
            await act(async () => {
                result.current.handleSearch(event);
            });

            expect(mockSearch).toHaveBeenCalledWith("matrix", { expand: true });
            expect(mockGetDoc).toHaveBeenCalledWith("post-1");
            expect(getResultsFromSearchResult(result.current.search)).toEqual([
                {
                    title: "Test Post",
                    slug: "post-1",
                    description: "desc",
                    tags: [],
                    authors: [],
                },
            ]);
        });
    });

    describe("resetSearch", () => {
        it("resets search results to type search with empty results", async () => {
            const { result } = renderHook(() => useSearch(false, "search-index.json"));
            await act(async () => {
                result.current.resetSearch();
            });
            expect(result.current.search.type).toBe("search");
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(0);
        });

        it("clears previously found results", async () => {
            const { result } = await renderLoadedSearch();

            const event = { target: { value: "matrix" } } as ChangeEvent<HTMLInputElement>;
            await act(async () => {
                result.current.handleSearch(event);
            });
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(1);

            await act(async () => {
                result.current.resetSearch();
            });

            expect(result.current.search.type).toBe("search");
            expect(getResultsFromSearchResult(result.current.search)).toHaveLength(0);
        });
    });
});
