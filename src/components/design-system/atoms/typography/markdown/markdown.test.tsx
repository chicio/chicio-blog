import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Markdown } from "./markdown";

describe("Markdown", () => {
    describe("render", () => {
        it("renders plain text content", async () => {
            render(<Markdown content="Hello world" id="test-1" />);
            expect(await screen.findByText("Hello world")).toBeInTheDocument();
        });

        it("renders a heading from markdown syntax", async () => {
            render(<Markdown content="# Title" id="test-2" />);
            expect(await screen.findByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
        });

        it("renders a paragraph with bold text", async () => {
            render(<Markdown content="Normal **bold** text" id="test-3" />);
            const strong = await screen.findByText("bold");
            expect(strong.tagName).toBe("STRONG");
        });

        it("renders a link from markdown syntax", async () => {
            render(<Markdown content="[Click here](https://example.com)" id="test-4" />);
            expect(await screen.findByRole("link", { name: "Click here" })).toHaveAttribute(
                "href",
                "https://example.com",
            );
        });

        it("renders each top-level block, splitting on markdown structure", async () => {
            render(<Markdown content={"# Title\n\nFirst paragraph.\n\nSecond paragraph."} id="test-5" />);
            expect(await screen.findByRole("heading", { level: 1, name: "Title" })).toBeInTheDocument();
            expect(await screen.findByText("First paragraph.")).toBeInTheDocument();
            expect(await screen.findByText("Second paragraph.")).toBeInTheDocument();
        });

        it("keeps a GFM table in a single block", async () => {
            render(<Markdown content={"| a | b |\n| - | - |\n| 1 | 2 |"} id="test-6" />);
            expect(await screen.findByRole("table")).toBeInTheDocument();
            expect(await screen.findByRole("cell", { name: "1" })).toBeInTheDocument();
        });
    });
});
