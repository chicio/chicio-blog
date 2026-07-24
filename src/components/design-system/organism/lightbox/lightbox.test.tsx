import { describe, it, expect } from "vitest";
import type { ReactNode } from "react";
import { vi } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render, motionDivMock } from "@/test-utils";
import { lightboxOpenEvent } from "@/components/design-system/state/lightbox/lightbox-events";
import { Lightbox } from "./index";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());

vi.mock("@/components/design-system/atoms/effects/overlay", () => ({
    Overlay: ({ children, onClick }: { children?: ReactNode; onClick?: () => void }) => (
        <div data-testid="lightbox-backdrop" onClick={onClick}>
            {children}
        </div>
    ),
}));

const dispatchOpen = async (src: string, alt: string) => {
    await act(async () => {
        window.dispatchEvent(new CustomEvent(lightboxOpenEvent, { detail: { src, alt } }));
    });
};

describe("Lightbox", () => {
    describe("render", () => {
        it("renders nothing before the open event fires", () => {
            render(<Lightbox />);
            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("renders the image and dialog semantics after the open event fires", async () => {
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            const dialog = screen.getByRole("dialog");
            expect(dialog).toHaveAttribute("aria-modal", "true");
            expect(screen.getByAltText("Bowser")).toHaveAttribute("src", "/media/content/art/2024-02-07.jpg");
        });

        it("moves focus into the dialog when it opens", async () => {
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            expect(screen.getByRole("dialog")).toHaveFocus();
        });
    });

    describe("closing", () => {
        it("closes on Escape", async () => {
            const user = userEvent.setup();
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            await user.keyboard("{Escape}");

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("closes when the backdrop is clicked", async () => {
            const user = userEvent.setup();
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            await user.click(screen.getByTestId("lightbox-backdrop"));

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("does not close when clicking inside the dialog", async () => {
            const user = userEvent.setup();
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            await user.click(screen.getByRole("dialog"));

            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });

        it("closes when the close button is clicked", async () => {
            const user = userEvent.setup();
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            await user.click(screen.getByRole("button", { name: "Close lightbox" }));

            expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
        });

        it("restores focus to the trigger element on close", async () => {
            const trigger = document.createElement("button");
            document.body.appendChild(trigger);
            trigger.focus();

            const user = userEvent.setup();
            render(<Lightbox />);
            await dispatchOpen("/media/content/art/2024-02-07.jpg", "Bowser");

            await user.keyboard("{Escape}");

            expect(trigger).toHaveFocus();
            document.body.removeChild(trigger);
        });
    });
});
