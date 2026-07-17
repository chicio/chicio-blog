import { describe, it, expect } from "vitest";
import { getArchivedCommentsBy } from "./comments";

describe("getArchivedCommentsBy", () => {
    describe("known slug", () => {
        it("returns the archived comments for that slug", () => {
            const comments = getArchivedCommentsBy("dynamic-imports-webpack-chunks");

            expect(comments).toHaveLength(1);
            expect(comments[0].author).toBe("Iftikhar Ali");
        });

        it("preserves one-level nested replies", () => {
            const comments = getArchivedCommentsBy("dynamic-imports-webpack-chunks");

            expect(comments[0].replies).toHaveLength(1);
            expect(comments[0].replies[0].author).toBe("Fabrizio");
        });

        it("returns comment bodies as sanitized HTML strings", () => {
            const comments = getArchivedCommentsBy("dynamic-imports-webpack-chunks");

            expect(comments[0].message).toContain("<p>");
        });

        it("parses date fields as valid ISO dates", () => {
            const comments = getArchivedCommentsBy("dynamic-imports-webpack-chunks");

            expect(new Date(comments[0].date).toString()).not.toBe("Invalid Date");
            expect(new Date(comments[0].replies[0].date).toString()).not.toBe("Invalid Date");
        });

        it("supports multiple top-level comments and replies for a single slug", () => {
            const comments = getArchivedCommentsBy("custom-tabbar-swiftui");

            expect(comments).toHaveLength(1);
            expect(comments[0].replies).toHaveLength(3);
        });

        it("returns an empty replies array when a comment has no replies", () => {
            const comments = getArchivedCommentsBy("first-threejs-scene");

            expect(comments[0].replies).toEqual([]);
        });
    });

    describe("unknown slug", () => {
        it("returns an empty array", () => {
            expect(getArchivedCommentsBy("a-slug-with-no-archived-comments")).toEqual([]);
        });
    });
});
