import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RedPillLink, BluePillLink } from "./pills-links";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("PillsLinks", () => {
    describe("RedPillLink", () => {
        describe("render", () => {
            it("renders children text", () => {
                render(<RedPillLink to="/prev">Previous</RedPillLink>);
                expect(screen.getByText("Previous")).toBeInTheDocument();
            });

            it("renders as a link with the correct href", () => {
                render(<RedPillLink to="/prev">Previous</RedPillLink>);
                expect(screen.getByRole("link")).toHaveAttribute("href", "/prev");
            });
        });

        describe("interaction", () => {
            it("calls onClick when clicked", async () => {
                const onClick = vi.fn();
                render(<RedPillLink to="/prev" onClick={onClick}>Previous</RedPillLink>);
                await userEvent.click(screen.getByRole("link"));
                expect(onClick).toHaveBeenCalledOnce();
            });
        });
    });

    describe("BluePillLink", () => {
        describe("render", () => {
            it("renders children text", () => {
                render(<BluePillLink to="/next">Next</BluePillLink>);
                expect(screen.getByText("Next")).toBeInTheDocument();
            });

            it("renders as a link with the correct href", () => {
                render(<BluePillLink to="/next">Next</BluePillLink>);
                expect(screen.getByRole("link")).toHaveAttribute("href", "/next");
            });
        });

        describe("interaction", () => {
            it("calls onClick when clicked", async () => {
                const onClick = vi.fn();
                render(<BluePillLink to="/next" onClick={onClick}>Next</BluePillLink>);
                await userEvent.click(screen.getByRole("link"));
                expect(onClick).toHaveBeenCalledOnce();
            });
        });
    });
});
