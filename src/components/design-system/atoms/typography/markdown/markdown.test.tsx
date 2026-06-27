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
    });
});
