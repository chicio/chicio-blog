import { describe, it, expect } from "vitest";
import { searchIndexFileName } from "./search-filename";

describe("searchIndexFileName", () => {
    it("is the expected filename constant", () => {
        expect(searchIndexFileName).toBe("search-index.json");
    });

    it("has a .json extension", () => {
        expect(searchIndexFileName.endsWith(".json")).toBe(true);
    });
});
