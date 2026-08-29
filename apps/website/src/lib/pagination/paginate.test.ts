import { describe, it, expect } from "vitest";
import { paginate } from "./paginate";

const items = [1, 2, 3, 4, 5, 6, 7];

describe("paginate", () => {
    describe("page window", () => {
        it("returns the first itemsPerPage items for page 1", () => {
            expect(paginate(items, 1, 3)?.items).toEqual([1, 2, 3]);
        });

        it("offsets the window by the page number", () => {
            expect(paginate(items, 2, 3)?.items).toEqual([4, 5, 6]);
        });

        it("returns a partial window for a last page that is not full", () => {
            expect(paginate(items, 3, 3)?.items).toEqual([7]);
        });

        it("does not mutate the source list", () => {
            const source = [3, 1, 2];

            paginate(source, 1, 2);

            expect(source).toEqual([3, 1, 2]);
        });
    });

    describe("totalPages", () => {
        it("rounds up when the last page is partial", () => {
            expect(paginate(items, 1, 3)?.totalPages).toBe(3);
        });

        it("is one when every item fits on a single page", () => {
            expect(paginate(items, 1, 10)?.totalPages).toBe(1);
        });
    });

    describe("hasPrevious and hasNext", () => {
        it("has no previous on the first page", () => {
            const page = paginate(items, 1, 3);

            expect(page?.hasPrevious).toBe(false);
            expect(page?.hasNext).toBe(true);
        });

        it("has both on a middle page", () => {
            const page = paginate(items, 2, 3);

            expect(page?.hasPrevious).toBe(true);
            expect(page?.hasNext).toBe(true);
        });

        it("has no next on the last page", () => {
            const page = paginate(items, 3, 3);

            expect(page?.hasPrevious).toBe(true);
            expect(page?.hasNext).toBe(false);
        });

        it("has neither when there is a single page", () => {
            const page = paginate(items, 1, 10);

            expect(page?.hasPrevious).toBe(false);
            expect(page?.hasNext).toBe(false);
        });
    });

    describe("out of range", () => {
        it("returns undefined past the last page", () => {
            expect(paginate(items, 4, 3)).toBeUndefined();
        });

        it("returns undefined for page zero", () => {
            expect(paginate(items, 0, 3)).toBeUndefined();
        });

        it("returns undefined for a negative page", () => {
            expect(paginate(items, -1, 3)).toBeUndefined();
        });

        it("returns undefined for an empty list", () => {
            expect(paginate([], 1, 3)).toBeUndefined();
        });
    });

    describe("echoed page number", () => {
        it("reports back the requested page", () => {
            expect(paginate(items, 2, 3)?.page).toBe(2);
        });
    });
});
