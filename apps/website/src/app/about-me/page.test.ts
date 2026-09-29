import { describe, it, expect, vi } from "vitest";

vi.mock("@/components/content/about-me/about-me", () => ({ AboutMe: vi.fn() }));

import { generateMetadata } from "./page";
import { aboutMe } from "@/lib/content/about-me/about-me";
import { slugs } from "@/types/configuration/slug";

describe("About me page generateMetadata", () => {
    it("takes title, description, image and keywords from the About me frontmatter", async () => {
        const { frontmatter } = aboutMe.single()!;

        const metadata = await generateMetadata();

        expect(metadata.title).toBe(frontmatter.title);
        expect(metadata.description).toBe(frontmatter.description);
        expect(metadata.keywords).toEqual(frontmatter.tags);
        expect(metadata.openGraph?.images).toEqual([{ url: frontmatter.image }]);
    });

    it("points the canonical URL at the About me page, not at Art", async () => {
        const metadata = await generateMetadata();

        expect(metadata.alternates?.canonical).toBe(slugs.aboutMe);
        expect(metadata.alternates?.canonical).not.toBe(slugs.art);
    });

    it("keeps the profile Open Graph type", async () => {
        const metadata = await generateMetadata();

        expect(metadata.openGraph).toMatchObject({ type: "profile" });
    });
});
