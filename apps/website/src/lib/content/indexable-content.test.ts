import { describe, it, expect } from "vitest";
import { getIndexableContent } from "./indexable-content";
import { slugs } from "@/types/configuration/slug";

describe("getIndexableContent", () => {
    describe("easter egg hunt entry", () => {
        const findEasterEggHuntEntry = () =>
            getIndexableContent().find((content) => content.slug.formatted === slugs.easterEggHunt);

        it("includes an entry for the easter egg hunt page", () => {
            expect(findEasterEggHuntEntry()).toBeDefined();
        });

        it("reads its title, description and tags from the MDX frontmatter", () => {
            const entry = findEasterEggHuntEntry();

            expect(entry?.frontmatter.title).toBe("Easter Egg Hunt");
            expect(entry?.frontmatter.description).toBe(
                "Hidden secrets are scattered across this site. Follow the clues and trigger the easter eggs yourself.",
            );
            expect(entry?.frontmatter.tags).toEqual(["easter egg", "matrix"]);
        });

        it("indexes the hint text from the MDX body, which the old synthetic entry left empty", () => {
            const entry = findEasterEggHuntEntry();

            expect(entry?.content).toContain("The White Rabbit");
            expect(entry?.content).toContain("no spoon");
        });

        it("has a date that parses to a valid Date (regression: sitemap.xml calls new Date(...).toISOString())", () => {
            const entry = findEasterEggHuntEntry();
            const parsedDate = new Date(entry!.frontmatter.date.formatted);

            expect(parsedDate.toString()).not.toBe("Invalid Date");
            expect(() => parsedDate.toISOString()).not.toThrow();
        });
    });
});
