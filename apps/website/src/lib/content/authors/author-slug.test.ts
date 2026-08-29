import { describe, it, expect } from "vitest";
import { authorHref, authorIdToSlug, authorSlugToId, generateAuthorSlug, ownerAuthorId } from "./author-slug";

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

describe("authorHref", () => {
    it("points the owner to the about-me page", () => {
        expect(authorHref(ownerAuthorId)).toBe("/about-me");
    });

    it("points other authors to their detail page", () => {
        expect(authorHref("marco_de_lucchi")).toBe("/blog/author/marco-de-lucchi");
    });
});
