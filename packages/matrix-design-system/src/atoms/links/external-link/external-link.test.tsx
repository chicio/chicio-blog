import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExternalLink } from "./external-link";

describe("ExternalLink", () => {
    describe("render", () => {
        it("renders an anchor with the provided href", () => {
            render(<ExternalLink href="https://example.com">Visit</ExternalLink>);
            expect(screen.getByRole("link", { name: "Visit" })).toHaveAttribute("href", "https://example.com");
        });

        it("applies className when provided", () => {
            render(
                <ExternalLink href="https://example.com" className="my-link">
                    Link
                </ExternalLink>,
            );
            expect(screen.getByRole("link")).toHaveClass("my-link");
        });

        it("forwards target and rel attributes", () => {
            render(
                <ExternalLink href="https://example.com" target="_blank" rel="noopener noreferrer">
                    Link
                </ExternalLink>,
            );
            const link = screen.getByRole("link");
            expect(link).toHaveAttribute("target", "_blank");
            expect(link).toHaveAttribute("rel", "noopener noreferrer");
        });

        it("renders children", () => {
            render(<ExternalLink href="https://example.com">Click here</ExternalLink>);
            expect(screen.getByText("Click here")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(
                <ExternalLink href="https://example.com" onClick={onClick}>
                    Link
                </ExternalLink>,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
