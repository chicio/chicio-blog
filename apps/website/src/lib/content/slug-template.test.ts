import { describe, it, expect } from "vitest";
import { matchSlugTemplate, pathSegmentsFor, slugFor } from "./slug-template";

const blogPost = "/blog/post/[year]/[month]/[day]/[slug]";
const console = "/videogames/console/[console]";
const game = "/videogames/console/[console]/game/[game]";

describe("slug template", () => {
    describe("matchSlugTemplate", () => {
        it("captures every dynamic segment of a deep template", () => {
            expect(matchSlugTemplate(blogPost, ["blog", "post", "2026", "07", "25", "my-post"])).toEqual({
                year: "2026",
                month: "07",
                day: "25",
                slug: "my-post",
            });
        });

        it("captures params separated by a literal segment", () => {
            expect(matchSlugTemplate(game, ["videogames", "console", "gameboy", "game", "tetris"])).toEqual({
                console: "gameboy",
                game: "tetris",
            });
        });

        it("returns an empty object for a template with no dynamic segments", () => {
            expect(matchSlugTemplate("/about-me", ["about-me"])).toEqual({});
        });

        describe("rejection", () => {
            it("rejects a path with too few segments", () => {
                expect(matchSlugTemplate(game, ["videogames", "console", "gameboy"])).toBeUndefined();
            });

            it("rejects a path with too many segments", () => {
                expect(
                    matchSlugTemplate(console, ["videogames", "console", "gameboy", "game", "tetris"]),
                ).toBeUndefined();
            });

            it("rejects a path whose literal segment differs", () => {
                expect(
                    matchSlugTemplate(game, ["videogames", "console", "gameboy", "cartridge", "tetris"]),
                ).toBeUndefined();
            });

            it("does not confuse the console template with the longer game template", () => {
                const path = ["videogames", "console", "gameboy", "game", "tetris"];

                expect(matchSlugTemplate(console, path)).toBeUndefined();
                expect(matchSlugTemplate(game, path)).toBeDefined();
            });

            it("rejects an empty path against a template that has segments", () => {
                expect(matchSlugTemplate(console, [])).toBeUndefined();
            });
        });
    });

    describe("pathSegmentsFor", () => {
        it("fills dynamic segments from params and keeps literals", () => {
            expect(pathSegmentsFor(game, { console: "gameboy", game: "tetris" })).toEqual([
                "videogames",
                "console",
                "gameboy",
                "game",
                "tetris",
            ]);
        });

        it("returns the literal segments when the template has no params", () => {
            expect(pathSegmentsFor("/blog/stats", {})).toEqual(["blog", "stats"]);
        });
    });

    describe("slugFor", () => {
        it("builds an absolute slug", () => {
            expect(slugFor(blogPost, { year: "2026", month: "07", day: "25", slug: "my-post" })).toBe(
                "/blog/post/2026/07/25/my-post",
            );
        });
    });

    describe("round trip", () => {
        it("matching the segments a template built returns the original params", () => {
            const params = { console: "playstation1", game: "crash-bandicoot" };

            expect(matchSlugTemplate(game, pathSegmentsFor(game, params))).toEqual(params);
        });
    });
});
