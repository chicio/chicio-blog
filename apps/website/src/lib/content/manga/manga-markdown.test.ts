import { describe, it, expect } from "vitest";
import { mangaListMarkdown, mangaMarkdown } from "./manga-markdown";
import { mangas } from "./manga";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

describe("manga-markdown", () => {
    describe("mangaListMarkdown", () => {
        it("renders the header, the intro and one line per manga with the Volumes owned", () => {
            const result = mangaListMarkdown({})!;
            const allManga = mangas.list();

            expect(result).toContain("# My Manga Collection");
            expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}${slugs.manga.home}`);
            expect(result).toContain(`## Manga (${allManga.length})`);
            allManga.forEach((manga) => {
                expect(result).toContain(
                    `[${manga.frontmatter.title}](${siteMetadata.siteUrl}${manga.slug.formatted})`,
                );
            });
            expect(result).toContain("(23/23 Volumes owned)");
        });

        it("drops the stats and catalog components the generator already renders", () => {
            const result = mangaListMarkdown({})!;

            expect(result).not.toContain("MangaStats");
            expect(result).not.toContain("MangaCatalog");
        });
    });

    describe("mangaMarkdown", () => {
        it("returns null for an unknown manga", () => {
            expect(mangaMarkdown({ manga: "unknown" })).toBeNull();
        });

        it("folds the metadata into the body, keeping every author of a series", () => {
            const result = mangaMarkdown({ manga: "death-note" })!;

            expect(result).toContain("# Death Note Complete Edition");
            expect(result).toContain("**Story by:** Tsugumi Ohba");
            expect(result).toContain("**Art by:** Takeshi Obata");
            expect(result).toContain("**Serialization:** 2003 – 2006");
            expect(result).toContain("**Status:** Completed");
            expect(result).toContain("**Edition:** Complete Edition (Panini Comics (Planet Manga), Italian)");
            expect(result).toContain("**Volumes owned:** 1/1");
            expect(result).toContain("Light Yagami");
        });

        it("gets the carousel from the body, once, and never a gallery from the metadata", () => {
            const result = mangaMarkdown({ manga: "death-note" })!;

            expect(result.match(/!\[[^\]]*\]\([^)]*death-note\/cover\.jpg\)/g)).toHaveLength(1);
            expect(result).not.toContain("Gallery");
            expect(result).not.toContain("ImageCarousel");
        });
    });
});
