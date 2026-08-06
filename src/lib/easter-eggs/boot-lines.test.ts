import { describe, it, expect } from "vitest";
import { bootLinesFor, toTypewriterLines } from "./boot-lines";

describe("boot-lines", () => {
    describe("bootLinesFor", () => {
        it("templates the slug into the first line", () => {
            const lines = bootLinesFor("the-one");
            expect(lines[0]).toBe("$ ./easter-egg --reveal the-one");
        });

        it("returns four lines total", () => {
            expect(bootLinesFor("dodge-this")).toHaveLength(4);
        });

        it("keeps the remaining three lines identical regardless of slug", () => {
            const lines = bootLinesFor("deja-vu");
            expect(lines.slice(1)).toEqual([
                "> decrypting payload … ok",
                "> mounting /dev/matrix",
                "> playback ready",
            ]);
        });
    });

    describe("toTypewriterLines", () => {
        it("wraps each string in a { text } object, preserving order", () => {
            expect(toTypewriterLines(["a", "b"])).toEqual([{ text: "a" }, { text: "b" }]);
        });

        it("returns an empty array for an empty input", () => {
            expect(toTypewriterLines([])).toEqual([]);
        });
    });
});
