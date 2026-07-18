import { describe, it, expect } from "vitest";
import { getIndexableContent } from "./indexable-content";
import { easterEggHuntPageDescription, easterEggHuntPageTitle } from "./easter-eggs/easter-eggs-content";
import { slugs } from "@/types/configuration/slug";

describe("getIndexableContent", () => {
    describe("easter egg hunt synthetic entry", () => {
        const findEasterEggHuntEntry = () =>
            getIndexableContent().find((content) => content.slug.formatted === slugs.easterEggHunt);

        it("includes an entry for the easter egg hunt page", () => {
            expect(findEasterEggHuntEntry()).toBeDefined();
        });

        it("carries the shared title, description and tags used for search/markdown", () => {
            const entry = findEasterEggHuntEntry();

            expect(entry?.frontmatter.title).toBe(easterEggHuntPageTitle);
            expect(entry?.frontmatter.description).toBe(easterEggHuntPageDescription);
            expect(entry?.frontmatter.tags).toEqual(["easter egg", "matrix"]);
            expect(entry?.frontmatter.authors).toEqual([]);
        });

        it("has a date that parses to a valid Date (regression: sitemap.xml calls new Date(...).toISOString())", () => {
            const entry = findEasterEggHuntEntry();
            const parsedDate = new Date(entry!.frontmatter.date.formatted);

            expect(parsedDate.toString()).not.toBe("Invalid Date");
            expect(() => parsedDate.toISOString()).not.toThrow();
        });
    });
});
