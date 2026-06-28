import { describe, it, expect } from "vitest";
import { shuffleArray } from "./shuffle-array";

describe("shuffleArray", () => {
    describe("output size", () => {
        it("returns exactly numberOfItems elements when array is larger", () => {
            const result = shuffleArray([1, 2, 3, 4, 5], 3);
            expect(result).toHaveLength(3);
        });

        it("returns all elements when numberOfItems equals array length", () => {
            const result = shuffleArray([1, 2, 3], 3);
            expect(result).toHaveLength(3);
        });

        it("returns all elements when numberOfItems exceeds array length", () => {
            const result = shuffleArray([1, 2], 5);
            expect(result).toHaveLength(2);
        });

        it("returns empty array when numberOfItems is 0", () => {
            const result = shuffleArray([1, 2, 3], 0);
            expect(result).toHaveLength(0);
        });
    });

    describe("immutability", () => {
        it("does not mutate the original array", () => {
            const original = [1, 2, 3, 4, 5];
            const copy = [...original];
            shuffleArray(original, 3);
            expect(original).toEqual(copy);
        });
    });

    describe("element membership", () => {
        it("only returns elements that exist in the original array", () => {
            const source = ["a", "b", "c", "d", "e"];
            const result = shuffleArray(source, 4);
            for (const item of result) {
                expect(source).toContain(item);
            }
        });

        it("returns no duplicate elements when source has unique values", () => {
            const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            const result = shuffleArray(source, 5);
            const unique = new Set(result);
            expect(unique.size).toBe(result.length);
        });
    });

    describe("default parameter", () => {
        it("returns an empty array when array is undefined", () => {
            const result = shuffleArray(undefined, 3);
            expect(result).toEqual([]);
        });
    });
});
