import { describe, it, expect } from "vitest";
import { siblingsOf } from "./siblings";
import { Content } from "@/types/content/content";

const makeItem = (slugFormatted: string): Content =>
    ({
        slug: { formatted: slugFormatted, params: {} },
        frontmatter: {
            title: slugFormatted,
            description: "",
            tags: [],
            authors: [],
            date: { formatted: "2024-01-01", year: 2024, month: 1, day: 1 },
            image: "",
        },
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
        contentFileRelativePath: "",
        content: "",
    }) as Content;

const items = [makeItem("/a"), makeItem("/b"), makeItem("/c")];

describe("siblingsOf", () => {
    describe("current", () => {
        it("returns the item matching the slug", () => {
            expect(siblingsOf(items, "/b")?.current.slug.formatted).toBe("/b");
        });

        it("returns undefined when the slug is not in the list", () => {
            expect(siblingsOf(items, "/missing")).toBeUndefined();
        });

        it("returns undefined for an empty list", () => {
            expect(siblingsOf([], "/a")).toBeUndefined();
        });
    });

    describe("neighbours", () => {
        it("exposes both neighbours in the middle of the list", () => {
            const siblings = siblingsOf(items, "/b");

            expect(siblings?.previous?.slug.formatted).toBe("/a");
            expect(siblings?.next?.slug.formatted).toBe("/c");
        });

        it("has no previous for the first item", () => {
            const siblings = siblingsOf(items, "/a");

            expect(siblings?.previous).toBeUndefined();
            expect(siblings?.next?.slug.formatted).toBe("/b");
        });

        it("has no next for the last item", () => {
            const siblings = siblingsOf(items, "/c");

            expect(siblings?.previous?.slug.formatted).toBe("/b");
            expect(siblings?.next).toBeUndefined();
        });

        it("has neither neighbour when the item is alone", () => {
            const siblings = siblingsOf([makeItem("/only")], "/only");

            expect(siblings?.previous).toBeUndefined();
            expect(siblings?.next).toBeUndefined();
        });
    });

    describe("ordering", () => {
        it("follows the order of the list it is given, not the slugs", () => {
            const reversed = [makeItem("/c"), makeItem("/b"), makeItem("/a")];

            expect(siblingsOf(reversed, "/b")?.previous?.slug.formatted).toBe("/c");
            expect(siblingsOf(reversed, "/b")?.next?.slug.formatted).toBe("/a");
        });
    });
});
