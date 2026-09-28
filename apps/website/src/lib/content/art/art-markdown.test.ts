import { describe, it, expect } from "vitest";
import { artMarkdown } from "./art-markdown";
import { artGallery } from "./art";

describe("artMarkdown", () => {
    it("renders a document for the art page", () => {
        expect(artMarkdown({})).not.toBeNull();
    });

    it("lists every drawing of the gallery with its caption and source", () => {
        const gallery = artGallery();
        const result = artMarkdown({})!;

        expect(gallery.length).toBeGreaterThan(100);
        gallery.forEach((image) => {
            expect(result).toContain(`![${image.caption}](${image.src})`);
        });
    });

    it("keeps the drawings in the gallery order", () => {
        const [first, second] = artGallery();
        const result = artMarkdown({})!;

        expect(result.indexOf(first.src)).toBeLessThan(result.indexOf(second.src));
    });
});
