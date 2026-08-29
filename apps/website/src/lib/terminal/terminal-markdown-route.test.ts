import { describe, it, expect } from "vitest";
import { toMarkdownFetchUrl } from "./terminal-markdown-route";

describe("terminal-markdown-route", () => {
    describe("toMarkdownFetchUrl", () => {
        it("maps the homepage route to the bare /markdown endpoint", () => {
            expect(toMarkdownFetchUrl("/")).toBe("/markdown");
        });

        it("prefixes any other route with /markdown", () => {
            expect(toMarkdownFetchUrl("/about-me")).toBe("/markdown/about-me");
        });

        it("prefixes a deeply nested route with /markdown", () => {
            expect(toMarkdownFetchUrl("/blog/post/2024/01/01/hello-world")).toBe(
                "/markdown/blog/post/2024/01/01/hello-world",
            );
        });
    });
});
