import { describe, it, expect } from "vitest";
import { contentRegistry } from "./registry";
import { matchSlugTemplate } from "./slug-template";
import { slugs } from "@/types/configuration/slug";

const entryFor = (slug: string) => contentRegistry.find((entry) => entry.slug === slug);

const registeredSlugs = contentRegistry.map((entry) => entry.slug);

describe("contentRegistry", () => {
    describe("coverage", () => {
        it.each([
            ["/", "homepage"],
            [slugs.blog.home, "blog listing"],
            [slugs.blog.stats, "blog stats"],
            [slugs.contact, "contact"],
            [slugs.aboutMe, "about me"],
            [slugs.mcp, "mcp"],
            [slugs.cookiePolicy, "cookie policy"],
            [slugs.art, "art"],
            [slugs.easterEggHunt, "easter egg hunt"],
            [slugs.dataStructuresAndAlgorithms.home, "dsa home"],
            [slugs.dataStructuresAndAlgorithms.roadmap, "dsa roadmap"],
            [slugs.dataStructuresAndAlgorithms.exercises, "dsa exercises list"],
            [slugs.videogames.home, "videogames home"],
            [slugs.blog.blogPost, "blog post"],
            [slugs.dataStructuresAndAlgorithms.topic, "dsa topic"],
            [slugs.dataStructuresAndAlgorithms.exercise, "dsa exercise"],
            [slugs.videogames.console, "videogame console"],
            [slugs.videogames.game, "videogame game"],
        ])("registers %s (%s)", (slug) => {
            expect(registeredSlugs).toContain(slug);
        });

        it("registers nothing twice", () => {
            expect(new Set(registeredSlugs).size).toBe(registeredSlugs.length);
        });
    });

    describe("collections", () => {
        const collectionSlugs = [
            slugs.blog.blogPost,
            slugs.dataStructuresAndAlgorithms.topic,
            slugs.dataStructuresAndAlgorithms.exercise,
            slugs.videogames.console,
            slugs.videogames.game,
        ];

        it.each(collectionSlugs)("%s expands to at least one concrete path", (slug) => {
            expect(entryFor(slug)?.params?.().length).toBeGreaterThan(0);
        });

        it.each(collectionSlugs)("%s yields params that satisfy its own slug template", (slug) => {
            const [firstParams] = entryFor(slug)!.params!();

            expect(Object.keys(firstParams).length).toBeGreaterThan(0);
        });

        it("gives every single page no params, so it expands to exactly one path", () => {
            const pages = contentRegistry.filter((entry) => !collectionSlugs.includes(entry.slug));

            pages.forEach((page) => {
                expect(page.params).toBeUndefined();
            });
        });
    });

    describe("ordering", () => {
        it("lists every single page before the first collection, so exact slugs win a match", () => {
            const firstCollectionIndex = contentRegistry.findIndex((entry) => entry.params !== undefined);
            const lastPageIndex = contentRegistry.reduce(
                (last, entry, index) => (entry.params === undefined ? index : last),
                -1,
            );

            expect(lastPageIndex).toBeLessThan(firstCollectionIndex);
        });

        it("has no page slug that a later collection template would also match", () => {
            const collections = contentRegistry.filter((entry) => entry.params !== undefined);
            const pages = contentRegistry.filter((entry) => entry.params === undefined);

            pages.forEach((page) => {
                const pageSegments = page.slug.split("/").filter((segment) => segment.length > 0);
                const shadowing = collections.filter(
                    (collection) => matchSlugTemplate(collection.slug, pageSegments) !== undefined,
                );

                expect(shadowing.map((entry) => `${page.slug} shadowed by ${entry.slug}`)).toEqual([]);
            });
        });
    });

    describe("search index", () => {
        it("indexes exactly the entries that carry real content", () => {
            const indexed = contentRegistry.filter((entry) => entry.indexed).map((entry) => entry.slug);

            expect(indexed.sort()).toEqual(
                [
                    slugs.aboutMe,
                    slugs.easterEggHunt,
                    slugs.dataStructuresAndAlgorithms.roadmap,
                    slugs.dataStructuresAndAlgorithms.exercises,
                    slugs.blog.blogPost,
                    slugs.dataStructuresAndAlgorithms.topic,
                    slugs.dataStructuresAndAlgorithms.exercise,
                    slugs.videogames.console,
                    slugs.videogames.game,
                ].sort(),
            );
        });

        it("does not index the aggregate listing pages, whose content lives on the pages they link to", () => {
            [slugs.blog.home, slugs.blog.stats, slugs.videogames.home, slugs.dataStructuresAndAlgorithms.home, "/"].forEach(
                (slug) => {
                    expect(entryFor(slug)?.indexed).toBeUndefined();
                },
            );
        });
    });
});
