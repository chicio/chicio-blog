import { describe, it, expect } from "vitest";
import { isMarkdownOutlineViable, isTableOfContentsViable } from "./heading-viability";
import type { ContentHeading } from "@/types/content/heading";

const makeHeadings = (count: number): ContentHeading[] =>
    Array.from({ length: count }, (_, index) => ({
        level: 2,
        id: `heading-${index}`,
        text: `Heading ${index}`,
        readingTime: { text: "", minutes: 0, time: 0, words: 0 },
    }));

describe("heading-viability", () => {
    describe("isTableOfContentsViable", () => {
        it.each([0, 1, 2])("is not viable with %i heading(s)", (count) => {
            expect(isTableOfContentsViable(makeHeadings(count))).toBe(false);
        });

        it.each([3, 4, 10])("is viable with %i headings", (count) => {
            expect(isTableOfContentsViable(makeHeadings(count))).toBe(true);
        });
    });

    describe("isMarkdownOutlineViable", () => {
        it.each([0, 1])("is not viable with %i heading(s)", (count) => {
            expect(isMarkdownOutlineViable(makeHeadings(count))).toBe(false);
        });

        it.each([2, 3, 10])("is viable with %i headings, including the exercise page's fixed count of 3", (count) => {
            expect(isMarkdownOutlineViable(makeHeadings(count))).toBe(true);
        });
    });
});
