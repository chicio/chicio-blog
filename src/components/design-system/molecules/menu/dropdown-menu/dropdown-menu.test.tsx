import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DropdownMenu } from "./dropdown-menu";

vi.mock("next/link", () => ({
    default: ({ href, children, className, onClick }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
        <a href={href} className={className} onClick={onClick}>{children}</a>
    ),
}));

vi.mock("framer-motion", () => ({
    AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("DropdownMenu", () => {
    const items = [
        { label: "About Me", to: "/about-me", selected: false },
        { label: "Blog", to: "/blog", selected: false },
    ];

    describe("render", () => {
        it("renders the trigger button with the label", () => {
            render(<DropdownMenu label="Navigation" items={items} />);
            expect(screen.getByRole("button", { name: /Navigation/ })).toBeInTheDocument();
        });

        it("has aria-haspopup and aria-expanded=false when closed", () => {
            render(<DropdownMenu label="Menu" items={items} />);
            const button = screen.getByRole("button", { name: /Menu/ });
            expect(button).toHaveAttribute("aria-haspopup", "menu");
            expect(button).toHaveAttribute("aria-expanded", "false");
        });

        it("does not show menu items when closed", () => {
            render(<DropdownMenu label="Nav" items={items} />);
            expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("opens the dropdown on button click", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            expect(screen.getByRole("menu")).toBeInTheDocument();
        });

        it("shows menu items after opening", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            await userEvent.click(screen.getByRole("button", { name: /Nav/ }));
            expect(screen.getByText("About Me")).toBeInTheDocument();
            expect(screen.getByText("Blog")).toBeInTheDocument();
        });

        it("sets aria-expanded to true when open", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            expect(button).toHaveAttribute("aria-expanded", "true");
        });

        it("closes the dropdown on second click", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            await userEvent.click(button);
            expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        });
    });
});
