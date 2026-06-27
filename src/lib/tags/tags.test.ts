import { describe, it, expect } from "vitest";
import { generateTagSlug } from "./tags";

describe("generateTagSlug", () => {
    describe("single-word tag", () => {
        it("produces the expected slug path", () => {
            expect(generateTagSlug("react")).toBe("/blog/tag/react/");
        });
    });

    describe("multi-word tag", () => {
        it("joins words with hyphens", () => {
            expect(generateTagSlug("clean code")).toBe("/blog/tag/clean-code/");
        });

        it("handles three-word tags", () => {
            expect(generateTagSlug("data structures algorithms")).toBe("/blog/tag/data-structures-algorithms/");
        });
    });

    describe("edge cases", () => {
        it("preserves casing", () => {
            expect(generateTagSlug("TypeScript")).toBe("/blog/tag/TypeScript/");
        });

        it("always ends with a trailing slash", () => {
            const slug = generateTagSlug("swift");
            expect(slug.endsWith("/")).toBe(true);
        });
    });
});
