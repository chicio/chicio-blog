import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SocialContact } from "./social-contact";

describe("SocialContact", () => {
    describe("render", () => {
        it("renders the icon", () => {
            render(
                <SocialContact
                    link="https://github.com/chicio"
                    icon={<span data-testid="gh-icon">GitHub</span>}
                />,
            );
            expect(screen.getByTestId("gh-icon")).toBeInTheDocument();
        });

        it("renders a link pointing to the correct href", () => {
            render(
                <SocialContact
                    link="https://github.com/chicio"
                    icon={<span>GH</span>}
                />,
            );
            expect(screen.getByRole("link")).toHaveAttribute("href", "https://github.com/chicio");
        });

        it("opens link in a new tab", () => {
            render(
                <SocialContact
                    link="https://github.com/chicio"
                    icon={<span>GH</span>}
                />,
            );
            expect(screen.getByRole("link")).toHaveAttribute("target", "_blank");
        });
    });

    describe("interaction", () => {
        it("calls onClick when the link is clicked", async () => {
            const onClick = vi.fn();
            render(
                <SocialContact
                    link="https://github.com/chicio"
                    icon={<span>GH</span>}
                    onClick={onClick}
                />,
            );
            await userEvent.click(screen.getByRole("link"));
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
