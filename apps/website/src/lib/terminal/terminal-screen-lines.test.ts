import { describe, it, expect } from "vitest";
import { toScreenLines } from "./terminal-screen-lines";

describe("terminal-screen-lines", () => {
    describe("toScreenLines", () => {
        it("assigns sequential ids starting at the given index and defaults missing kind to normal", () => {
            const result = toScreenLines([{ text: "hello" }, { text: "boom", kind: "error" }], 5);

            expect(result).toEqual([
                { id: "line-5", text: "hello", kind: "normal" },
                { id: "line-6", text: "boom", kind: "error" },
            ]);
        });

        it("returns an empty array for empty input", () => {
            expect(toScreenLines([], 0)).toEqual([]);
        });
    });
});
