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

    it("renders no outline at all when sections is omitted", () => {
        const result = markdownDocument({ title: "T", description: "D", slug: "/t", body: "Body." });

        expect(result).not.toContain("## Table of Contents");
    });

    it("renders no outline when sections is an empty array", () => {
        const result = markdownDocument({ title: "T", description: "D", slug: "/t", body: "Body.", sections: [] });

        expect(result).not.toContain("## Table of Contents");
    });

    it("renders a citable outline, right after the header and ahead of the body, when sections is given", () => {
        const result = markdownDocument({
            title: "Graph",
            description: "Graph algorithms",
            slug: "/dsa/topic/graph",
            body: "Graph body.",
            sections: [
                { level: 2, text: "Introduction", url: `${siteMetadata.siteUrl}/dsa/topic/graph#introduction` },
                { level: 3, text: "BFS", url: `${siteMetadata.siteUrl}/dsa/topic/graph#bfs` },
                { level: 2, text: "Exercises", url: `${siteMetadata.siteUrl}/dsa/topic/graph#exercises` },
            ],
        });

        expect(result).toBe(`# Graph

> Graph algorithms

**URL:** ${siteMetadata.siteUrl}/dsa/topic/graph

---

## Table of Contents

- [Introduction](${siteMetadata.siteUrl}/dsa/topic/graph#introduction)
  - [BFS](${siteMetadata.siteUrl}/dsa/topic/graph#bfs)
- [Exercises](${siteMetadata.siteUrl}/dsa/topic/graph#exercises)

---

Graph body.
`);
    });
});
