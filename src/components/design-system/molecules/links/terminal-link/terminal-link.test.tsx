import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalLink } from "./terminal-link";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("TerminalLink", () => {
    describe("render", () => {
        it("renders the label text", () => {
            render(<TerminalLink to="/about" label="About Me" />);
            expect(screen.getByText(/About Me/)).toBeInTheDocument();
        });

        it("renders a link pointing to the correct href", () => {
            render(<TerminalLink to="/about" label="About Me" />);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(<TerminalLink to="/about" label="About Me" onClick={onClick} />);
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
