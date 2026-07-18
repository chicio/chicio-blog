import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TerminalButton } from "./terminal-button";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

describe("TerminalButton", () => {
    describe("link mode", () => {
        it("renders the label text", () => {
            render(<TerminalButton to="/about" label="About Me" />);
            expect(screen.getByText(/About Me/)).toBeInTheDocument();
        });

        it("renders a link pointing to the correct href", () => {
            render(<TerminalButton to="/about" label="About Me" />);
            expect(screen.getByRole("link")).toHaveAttribute("href", "/about");
        });

        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(<TerminalButton to="/about" label="About Me" onClick={onClick} />);
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });

    describe("action mode", () => {
        it("renders a real button with the label text", () => {
            render(<TerminalButton label="reveal" onClick={vi.fn()} />);
            expect(screen.getByRole("button", { name: /reveal/ })).toBeInTheDocument();
        });

        it("calls onClick when the button is clicked", async () => {
            const onClick = vi.fn();
            render(<TerminalButton label="reveal" onClick={onClick} />);
            await userEvent.click(screen.getByRole("button", { name: /reveal/ }));
            expect(onClick).toHaveBeenCalledOnce();
        });

        it("maps ariaExpanded to the aria-expanded attribute", () => {
            render(<TerminalButton label="hide" onClick={vi.fn()} ariaExpanded={true} />);
            expect(screen.getByRole("button", { name: /hide/ })).toHaveAttribute("aria-expanded", "true");
        });
    });
});
