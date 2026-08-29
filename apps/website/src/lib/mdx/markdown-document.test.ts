import { describe, it, expect } from "vitest";
import { markdownDocument } from "./markdown-document";
import { siteMetadata } from "@/types/configuration/site-metadata";

describe("markdownDocument", () => {
    it("renders the canonical header followed by the body", () => {
        const result = markdownDocument({
            title: "About Me",
            description: "A short bio.",
            slug: "/about-me",
            body: "Full body content here.",
        });

        expect(result).toBe(`# About Me

> A short bio.

**URL:** ${siteMetadata.siteUrl}/about-me

---

Full body content here.
`);
    });

    it("interpolates the slug into the URL line", () => {
        const result = markdownDocument({
            title: "Contact",
            description: "Get in touch.",
            slug: "/contact",
            body: "Email me.",
        });

        expect(result).toContain(`**URL:** ${siteMetadata.siteUrl}/contact`);
    });

    it("preserves a multi-line body verbatim", () => {
        const body = "## Section\n\n- one\n- two";
        const result = markdownDocument({ title: "T", description: "D", slug: "/t", body });

        expect(result.endsWith(`${body}\n`)).toBe(true);
    });
});
