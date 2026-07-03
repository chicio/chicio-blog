import { describe, it, expect } from "vitest";
import { authorIdToSlug, authorSlugToId, generateAuthorSlug } from "./author-slug";

describe("authorIdToSlug", () => {
    it("replaces underscores with hyphens", () => {
        expect(authorIdToSlug("fabrizio_duroni")).toBe("fabrizio-duroni");
    });

    it("replaces every underscore for multi-word keys", () => {
        expect(authorIdToSlug("marco_de_lucchi")).toBe("marco-de-lucchi");
    });
});

describe("authorSlugToId", () => {
    it("replaces hyphens with underscores", () => {
        expect(authorSlugToId("fabrizio-duroni")).toBe("fabrizio_duroni");
    });

    it("round-trips with authorIdToSlug", () => {
        const id = "marco_de_lucchi";
        expect(authorSlugToId(authorIdToSlug(id))).toBe(id);
    });
});

describe("generateAuthorSlug", () => {
    it("builds the author detail href from the hyphenated slug", () => {
        expect(generateAuthorSlug("fabrizio_duroni")).toBe("/blog/author/fabrizio-duroni");
    });
});
