import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RedPillButton, BluePillButton } from "./pills-buttons";

describe("PillsButtons", () => {
    describe("RedPillButton", () => {
        describe("render", () => {
            it("renders children text", () => {
                render(<RedPillButton onClick={vi.fn()}>Take the red pill</RedPillButton>);
                expect(screen.getByText("Take the red pill")).toBeInTheDocument();
            });

            it("renders a button element", () => {
                render(<RedPillButton onClick={vi.fn()}>Red</RedPillButton>);
                expect(screen.getByRole("button")).toBeInTheDocument();
            });
        });

        describe("interaction", () => {
            it("calls onClick when clicked", async () => {
                const onClick = vi.fn();
                render(<RedPillButton onClick={onClick}>Red</RedPillButton>);
                await userEvent.click(screen.getByRole("button"));
                expect(onClick).toHaveBeenCalledOnce();
            });

            it("is disabled when disabled prop is true", () => {
                render(<RedPillButton onClick={vi.fn()} disabled={true}>Red</RedPillButton>);
                expect(screen.getByRole("button")).toBeDisabled();
            });
        });

        describe("className", () => {
            /**
             * It has to reach the `button` itself: Tailwind's preflight sets `text-transform: none` on
             * `button`, so an inheritable utility placed on any ancestor never reaches the pill label.
             */
            it("applies the given class to the button element, keeping the base classes", () => {
                render(
                    <RedPillButton onClick={vi.fn()} className="uppercase">
                        Red
                    </RedPillButton>,
                );
                const button = screen.getByRole("button");
                expect(button.className).toContain("uppercase");
                expect(button.className).toContain("cursor-pointer");
            });

            it("keeps the accessible name in its original case so it is not read out letter by letter", () => {
                render(
                    <RedPillButton onClick={vi.fn()} className="uppercase">
                        reveal all solutions
                    </RedPillButton>,
                );
                expect(screen.getByRole("button", { name: "reveal all solutions" })).toBeInTheDocument();
            });
        });
    });

    describe("BluePillButton", () => {
        describe("render", () => {
            it("renders children text", () => {
                render(<BluePillButton onClick={vi.fn()}>Take the blue pill</BluePillButton>);
                expect(screen.getByText("Take the blue pill")).toBeInTheDocument();
            });

            it("renders a button element", () => {
                render(<BluePillButton onClick={vi.fn()}>Blue</BluePillButton>);
                expect(screen.getByRole("button")).toBeInTheDocument();
            });
        });

        describe("interaction", () => {
            it("calls onClick when clicked", async () => {
                const onClick = vi.fn();
                render(<BluePillButton onClick={onClick}>Blue</BluePillButton>);
                await userEvent.click(screen.getByRole("button"));
                expect(onClick).toHaveBeenCalledOnce();
            });
        });
    });
});
