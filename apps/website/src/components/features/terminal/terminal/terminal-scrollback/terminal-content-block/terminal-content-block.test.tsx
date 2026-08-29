import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TerminalContentBlock } from "./terminal-content-block";

describe("TerminalContentBlock", () => {
    describe("render", () => {
        it("shows a loading line while status is loading", () => {
            render(<TerminalContentBlock id="1" kind="content" route="/blog" title="Blog" status="loading" />);
            expect(screen.getByText("loading Blog...")).toBeInTheDocument();
        });

        it("shows an unavailable message when status is unavailable", () => {
            render(<TerminalContentBlock id="1" kind="content" route="/blog" title="Blog" status="unavailable" />);
            expect(screen.getByText(/no terminal view available/)).toBeInTheDocument();
        });

        it("shows an error message when status is error", () => {
            render(<TerminalContentBlock id="1" kind="content" route="/blog" title="Blog" status="error" />);
            expect(screen.getByText(/failed to load content/)).toBeInTheDocument();
        });

        it("renders the fetched markdown when status is success", () => {
            render(
                <TerminalContentBlock
                    id="1"
                    kind="content"
                    route="/blog"
                    title="Blog"
                    status="success"
                    markdown="# Hello"
                />,
            );
            expect(screen.getByRole("heading", { level: 1, name: "Hello" })).toBeInTheDocument();
        });

        it("applies the green phosphor duotone filter to images without dropping their alt text", () => {
            render(
                <TerminalContentBlock
                    id="1"
                    kind="content"
                    route="/blog"
                    title="Blog"
                    status="success"
                    markdown="![a screenshot](/media/screenshot.png)"
                />,
            );
            const image = screen.getByRole("img", { name: "a screenshot" });

            expect(image).toBeInTheDocument();

            const phosphorContainer = screen.getByTestId("terminal-content-phosphor-images");

            expect(phosphorContainer).toContainElement(image);
            expect(phosphorContainer.className).toContain("[&_img]:[filter:url(#terminal-phosphor)]");
            expect(phosphorContainer.className).toContain("[&_img]:border-accent/40");
        });
    });
});
