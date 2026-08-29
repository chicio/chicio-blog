import { describe, it, expect } from "vitest";
import { imageShimmerPlaceholder } from "./image-shimmer-placeholder";

describe("imageShimmerPlaceholder", () => {
    describe("value", () => {
        it("is a base64-encoded SVG data URI", () => {
            expect(imageShimmerPlaceholder).toMatch(/^data:image\/svg\+xml;base64,/);
        });

        it("decodes to an SVG with expected Matrix green colors", () => {
            const base64 = imageShimmerPlaceholder.replace("data:image/svg+xml;base64,", "");
            const svg = Buffer.from(base64, "base64").toString("utf-8");
            expect(svg).toContain("<svg");
            expect(svg).toContain("#001100");
        });
    });
});
