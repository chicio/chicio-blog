import { describe, it, expect, vi } from "vitest";

const { mockReadFileSync, mockMatter } = vi.hoisted(() => ({
    mockReadFileSync: vi.fn(() => ""),
    mockMatter: vi.fn(),
}));

vi.mock("fs", () => ({
    default: { readFileSync: mockReadFileSync },
}));

vi.mock("gray-matter", () => ({
    default: mockMatter,
}));

import { grayMatterContent } from "./gray-matter";

const baseFrontmatter = {
    title: "Test Post",
    description: "A test post",
    date: new Date("2024-01-01"),
    tags: ["react"],
    image: "/image.jpg",
};

describe("grayMatterContent", () => {
    describe("authors resolution", () => {
        it("throws when a frontmatter author id has no matching definition", () => {
            mockMatter.mockReturnValue({
                data: { ...baseFrontmatter, authors: ["unknown_author"] },
                content: "content",
            });

            expect(() => grayMatterContent("/fake/path/content.mdx")).toThrow(
                'Unknown author id "unknown_author" referenced in /fake/path/content.mdx',
            );
        });

        it("resolves a known author id into a full Author object", () => {
            mockMatter.mockReturnValue({
                data: { ...baseFrontmatter, authors: ["fabrizio_duroni"] },
                content: "content",
            });

            const result = grayMatterContent("/fake/path/content.mdx");

            expect(result.frontmatter.authors).toHaveLength(1);
            expect(result.frontmatter.authors[0].id).toBe("fabrizio_duroni");
            expect(result.frontmatter.authors[0].name).toBe("Fabrizio Duroni");
        });
    });
});
