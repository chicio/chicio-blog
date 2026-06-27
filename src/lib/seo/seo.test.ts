import { describe, it, expect } from "vitest";
import { createMetadata, createStructuredData } from "./seo";
import { siteMetadata } from "@/types/configuration/site-metadata";

const baseArgs = {
    author: "Fabrizio Duroni",
    title: "Test Page",
    slug: "/test",
    imageUrl: "/test-image.jpg",
    ogPageType: "website" as const,
};

describe("seo", () => {
    describe("createMetadata", () => {
        it("sets the metadataBase to the site URL", () => {
            const meta = createMetadata(baseArgs);
            // URL.toString() may append a trailing slash — strip it for comparison
            expect(meta.metadataBase?.toString().replace(/\/$/, "")).toBe(siteMetadata.siteUrl);
        });

        it("sets title and description from the provided title when no description given", () => {
            const meta = createMetadata(baseArgs);
            expect(meta.title).toBe("Test Page");
            expect(meta.description).toBe("Test Page");
        });

        it("uses explicit description when provided", () => {
            const meta = createMetadata({ ...baseArgs, description: "Custom desc" });
            expect(meta.description).toBe("Custom desc");
        });

        it("sets OpenGraph fields correctly", () => {
            const meta = createMetadata(baseArgs);
            const og = meta.openGraph as Record<string, unknown>;
            expect(og.title).toBe("Test Page");
            expect(og.url).toBe("/test");
            expect(og.locale).toBe("en_US");
            expect(og.type).toBe("website");
        });

        it("sets Twitter card fields", () => {
            const meta = createMetadata(baseArgs);
            const twitter = meta.twitter as Record<string, unknown>;
            expect(twitter.card).toBe("summary");
            expect(twitter.site).toBe("@chicio86");
        });

        it("uses provided keywords over defaults", () => {
            const meta = createMetadata({ ...baseArgs, keywords: ["custom", "keywords"] });
            expect(meta.keywords).toEqual(["custom", "keywords"]);
        });

        it("sets canonical alternates URL to the slug", () => {
            const meta = createMetadata(baseArgs);
            const alternates = meta.alternates as Record<string, unknown>;
            expect(alternates.canonical).toBe("/test");
        });
    });

    describe("createStructuredData", () => {
        const structuredDataArgs = {
            type: "Website" as const,
            url: "https://www.fabrizioduroni.it",
            imageUrl: "/test-image.jpg",
            author: "Fabrizio Duroni",
            title: "Test Site",
            links: {
                twitter: "https://twitter.com/chicio86",
                facebook: "https://www.facebook.com/fabrizio.duroni",
                linkedin: "https://www.linkedin.com/in/fabrizio-duroni/",
                github: "https://github.com/chicio",
                medium: "https://medium.com/@chicio",
                devto: "https://dev.to/chicio",
                instagram: "https://www.instagram.com/__chicio__/",
            },
        };

        it("sets @context to schema.org", () => {
            const data = createStructuredData(structuredDataArgs);
            expect(data["@context"]).toBe("https://schema.org");
        });

        it("sets @type to the provided type", () => {
            const data = createStructuredData(structuredDataArgs);
            expect(data["@type"]).toBe("Website");
        });

        it("includes full image URL by prepending siteUrl", () => {
            const data = createStructuredData(structuredDataArgs);
            expect(data.image).toBe(`${siteMetadata.siteUrl}/test-image.jpg`);
        });

        it("includes author block for non-Person types", () => {
            const data = createStructuredData(structuredDataArgs) as Record<string, unknown>;
            expect(data.author).toBeDefined();
        });

        it("includes sameAs links for Person type", () => {
            const personData = createStructuredData({ ...structuredDataArgs, type: "Person" as const }) as Record<
                string,
                unknown
            >;
            expect(Array.isArray(personData.sameAs)).toBe(true);
            expect((personData.sameAs as string[]).length).toBe(7);
        });

        it("truncates BlogPosting headline to 110 chars", () => {
            const longTitle = "A".repeat(120);
            const data = createStructuredData({
                ...structuredDataArgs,
                type: "BlogPosting" as const,
                title: longTitle,
                date: { year: 2024, month: 1, day: 15, formatted: "2024-01-15" },
            }) as Record<string, unknown>;
            expect((data.headline as string).length).toBe(110);
        });

        it("formats BlogPosting date correctly", () => {
            const data = createStructuredData({
                ...structuredDataArgs,
                type: "BlogPosting" as const,
                title: "Test Post",
                date: { year: 2024, month: 3, day: 5, formatted: "2024-03-05" },
            }) as Record<string, unknown>;
            expect(data.datePublished).toBe("2024-03-05T00:00:00+00:00");
        });
    });
});
