import { describe, it, expect, vi } from "vitest";

const { mockGetSingleContentBy, mockGetAllContentFor } = vi.hoisted(() => ({
    mockGetSingleContentBy: vi.fn(),
    mockGetAllContentFor: vi.fn(() => []),
}));

vi.mock("@/lib/content/content", () => ({
    getSingleContentBy: mockGetSingleContentBy,
    getAllContentFor: mockGetAllContentFor,
}));

import { mdxPageMarkdown } from "./mdx-page-markdown";
import { siteMetadata } from "@/types/configuration/site-metadata";

describe("mdxPageMarkdown", () => {
    it("returns null when the content does not exist", () => {
        mockGetSingleContentBy.mockReturnValue(undefined);

        expect(mdxPageMarkdown("/missing")).toBeNull();
    });

    it("renders the canonical markdown document from frontmatter + content", () => {
        mockGetSingleContentBy.mockReturnValue({
            frontmatter: { title: "MCP fabrizioduroni.it", description: "Connect your AI assistant." },
            slug: { formatted: "/mcp", params: {} },
            content: "Some **MDX** body.",
        });

        const result = mdxPageMarkdown("/mcp");

        expect(result).toBe(`# MCP fabrizioduroni.it

> Connect your AI assistant.

**URL:** ${siteMetadata.siteUrl}/mcp

---

Some **MDX** body.
`);
    });

    it("strips a leading body heading that duplicates the frontmatter title", () => {
        mockGetSingleContentBy.mockReturnValue({
            frontmatter: { title: "Cookies Policy", description: "How this site uses cookies." },
            slug: { formatted: "/cookie-policy", params: {} },
            content: "# Cookies Policy\n\nLast updated: ...",
        });

        const result = mdxPageMarkdown("/cookie-policy");

        expect(result).toBe(`# Cookies Policy

> How this site uses cookies.

**URL:** ${siteMetadata.siteUrl}/cookie-policy

---

Last updated: ...
`);
        expect(result?.match(/# Cookies Policy/g)).toHaveLength(1);
    });

    it("leaves a body untouched when it does not open with a duplicate title heading", () => {
        mockGetSingleContentBy.mockReturnValue({
            frontmatter: { title: "About Me", description: "Bio." },
            slug: { formatted: "/about-me", params: {} },
            content: "## Biography\n\nHello there.",
        });

        const result = mdxPageMarkdown("/about-me");

        expect(result).toContain("## Biography");
        expect(result?.match(/# About Me/g)).toHaveLength(1);
    });

    it("resolves the page by its slug, with no params, like a collection item with none", () => {
        mockGetSingleContentBy.mockReturnValue({
            frontmatter: { title: "T", description: "D" },
            slug: { formatted: "/art", params: {} },
            content: "Body",
        });

        mdxPageMarkdown("/art");

        expect(mockGetSingleContentBy).toHaveBeenCalledWith("/art", {});
    });
});
