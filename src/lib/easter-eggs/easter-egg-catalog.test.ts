import { describe, it, expect } from "vitest";
import { EASTER_EGG_CATALOG, EASTER_EGG_SLUGS, isEasterEggSlug } from "./easter-egg-catalog";

describe("easter-egg-catalog", () => {
    describe("EASTER_EGG_SLUGS", () => {
        it("lists exactly the six committed easter eggs", () => {
            expect(EASTER_EGG_SLUGS).toEqual([
                "the-white-rabbit",
                "deja-vu",
                "i-know-kung-fu",
                "there-is-no-spoon",
                "the-one",
                "dodge-this",
            ]);
        });
    });

    describe("EASTER_EGG_CATALOG", () => {
        it("has one entry per slug with matching video, poster and captions paths", () => {
            EASTER_EGG_SLUGS.forEach((slug) => {
                const entry = EASTER_EGG_CATALOG[slug];
                expect(entry.slug).toBe(slug);
                expect(entry.videoSrc).toBe(`/media/video/${slug}.mp4`);
                expect(entry.poster).toBe(`/media/video/${slug}-poster.jpg`);
                expect(entry.captions).toBe(`/media/video/${slug}.vtt`);
                expect(entry.title.length).toBeGreaterThan(0);
                expect(entry.trackingAction.length).toBeGreaterThan(0);
            });
        });
    });

    describe("isEasterEggSlug", () => {
        it("returns true for a known slug", () => {
            expect(isEasterEggSlug("the-one")).toBe(true);
        });

        it("returns false for an unknown string", () => {
            expect(isEasterEggSlug("not-a-real-egg")).toBe(false);
        });

        it("returns false for a non-string value", () => {
            expect(isEasterEggSlug(42)).toBe(false);
        });
    });
});
