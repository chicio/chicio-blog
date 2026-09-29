import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/content/art/art", () => ({ Art: vi.fn() }));

import { generateMetadata } from "./page";
import { art } from "@/lib/content/art/art";
import { slugs } from "@/types/configuration/slug";

describe("Art page generateMetadata", () => {
    it("takes title, description, image and keywords from the Art frontmatter", async () => {
        const { frontmatter } = art.single()!;

        const metadata = await generateMetadata();

        expect(metadata.title).toBe(frontmatter.title);
        expect(metadata.description).toBe(frontmatter.description);
        expect(metadata.keywords).toEqual(frontmatter.tags);
        expect(metadata.openGraph?.images).toEqual([{ url: frontmatter.image }]);
    });

    it("points the canonical URL at the Art page", async () => {
        const metadata = await generateMetadata();

        expect(metadata.alternates?.canonical).toBe(slugs.art);
    });
});
