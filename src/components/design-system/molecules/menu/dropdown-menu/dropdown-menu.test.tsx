import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
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
        {
            label: "Section one",
            items: [
                { label: "About Me", to: "/about-me", selected: false },
                { label: "Blog", to: "/blog", selected: false },
            ],
        },
        {
            label: "Section two",
            items: [{ label: "Contact", to: "/contact", selected: false }],
        },
    ];

    describe("render", () => {
        it("renders the trigger button with the label", () => {
            render(<DropdownMenu label="Navigation" items={items} />);
            expect(screen.getByRole("button", { name: /Navigation/ })).toBeInTheDocument();
        });

        it("has aria-expanded=false and no aria-controls when closed", () => {
            render(<DropdownMenu label="Menu" items={items} />);
            const button = screen.getByRole("button", { name: /Menu/ });
            expect(button).toHaveAttribute("aria-expanded", "false");
            expect(button).not.toHaveAttribute("aria-controls");
        });

        it("does not have aria-haspopup or role=menu", () => {
            render(<DropdownMenu label="Menu" items={items} />);
            const button = screen.getByRole("button", { name: /Menu/ });
            expect(button).not.toHaveAttribute("aria-haspopup");
            expect(screen.queryByRole("menu")).not.toBeInTheDocument();
        });

        it("does not show menu items when closed", () => {
            render(<DropdownMenu label="Nav" items={items} />);
            expect(screen.queryByRole("list", { name: "Nav" })).not.toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("opens the dropdown on button click", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            expect(screen.getByRole("list", { name: "Nav" })).toBeInTheDocument();
        });

        it("shows menu items after opening", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            await userEvent.click(screen.getByRole("button", { name: /Nav/ }));
            expect(screen.getByText("About Me")).toBeInTheDocument();
            expect(screen.getByText("Blog")).toBeInTheDocument();
        });

        it("renders group headers and never role=menu or aria-haspopup", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            await userEvent.click(screen.getByRole("button", { name: /Nav/ }));
            expect(screen.getByText("Section one")).toBeInTheDocument();
            expect(screen.getByText("Section two")).toBeInTheDocument();
            expect(screen.queryByRole("menu")).not.toBeInTheDocument();
            expect(screen.getByRole("button", { name: /Nav/ })).not.toHaveAttribute("aria-haspopup");
        });

        it("labels each group's nested list via aria-labelledby pointing at its header span", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            await userEvent.click(screen.getByRole("button", { name: /Nav/ }));
            const sectionOneHeader = screen.getByText("Section one");
            const sectionOneList = screen.getByRole("list", { name: "Section one" });
            expect(sectionOneHeader).toHaveAttribute("id", sectionOneList.getAttribute("aria-labelledby"));
            expect(within(sectionOneList).getByRole("link", { name: "About Me" })).toBeInTheDocument();

            const sectionTwoHeader = screen.getByText("Section two");
            const sectionTwoList = screen.getByRole("list", { name: "Section two" });
            expect(sectionTwoHeader).toHaveAttribute("id", sectionTwoList.getAttribute("aria-labelledby"));
            expect(within(sectionTwoList).getByRole("link", { name: "Contact" })).toBeInTheDocument();
        });

        it("sets aria-expanded to true and aria-controls to the panel id when open", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            expect(button).toHaveAttribute("aria-expanded", "true");
            const panel = screen.getByRole("list", { name: "Nav" });
            expect(button).toHaveAttribute("aria-controls", panel.id);
        });

        it("closes the dropdown on second click", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            await userEvent.click(button);
            expect(screen.queryByRole("list", { name: "Nav" })).not.toBeInTheDocument();
        });

        it("closes the dropdown and returns focus to the trigger button on Escape", async () => {
            render(<DropdownMenu label="Nav" items={items} />);
            const button = screen.getByRole("button", { name: /Nav/ });
            await userEvent.click(button);
            const link = screen.getByRole("link", { name: "About Me" });
            link.focus();
            await userEvent.keyboard("{Escape}");
            expect(screen.queryByRole("list", { name: "Nav" })).not.toBeInTheDocument();
            expect(button).toHaveFocus();
        });
    });
});
