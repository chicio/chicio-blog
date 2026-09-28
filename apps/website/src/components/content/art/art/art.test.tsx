import { describe, it, expect, vi, beforeAll } from "vitest";
import type { ReactNode } from "react";
import { render, screen, nextImageMock } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { Art } from "./index";
import { lightboxOpenEvent } from "matrix-design-system";

vi.mock("next/image", () => nextImageMock());

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/lib/content/art/art", () => ({
    artGallery: () => [
        { src: "/media/content/art/2024-02-07.jpg", caption: "Bowser from Super Mario Wonder" },
        { src: "/media/content/art/2023-10-31.jpg", caption: "Giant pumpkin" },
    ],
}));

class IntersectingObserver {
    constructor(private readonly callback: IntersectionObserverCallback) {}
    observe(target: Element) {
        this.callback([{ target, isIntersecting: true } as IntersectionObserverEntry], this as never);
    }
    unobserve() {}
    disconnect() {}
}

describe("Art", () => {
    beforeAll(() => {
        vi.stubGlobal("IntersectionObserver", IntersectingObserver);
    });

    describe("render", () => {
        it("renders a card for every image of the gallery", () => {
            render(<Art />);
            expect(screen.getByAltText("Bowser from Super Mario Wonder")).toHaveAttribute(
                "src",
                "/media/content/art/2024-02-07.jpg",
            );
            expect(screen.getByAltText("Giant pumpkin")).toHaveAttribute("src", "/media/content/art/2023-10-31.jpg");
        });

        it("renders the caption on each card", () => {
            render(<Art />);
            expect(screen.getByText("Giant pumpkin")).toBeInTheDocument();
            expect(screen.getByText("Bowser from Super Mario Wonder")).toBeInTheDocument();
        });

        it("does not link the cards to a page", () => {
            render(<Art />);
            expect(screen.queryByRole("link")).not.toBeInTheDocument();
        });
    });

    describe("lightbox", () => {
        it("opens the shared lightbox with the image and its caption when a card is clicked", async () => {
            const lightboxOpened = vi.fn();
            window.addEventListener(lightboxOpenEvent, lightboxOpened);
            const user = userEvent.setup();
            render(<Art />);

            await user.click(screen.getByRole("button", { name: "Open Giant pumpkin" }));

            expect(lightboxOpened).toHaveBeenCalledTimes(1);
            expect(lightboxOpened.mock.calls[0][0].detail).toEqual({
                src: "/media/content/art/2023-10-31.jpg",
                alt: "Giant pumpkin",
            });
            window.removeEventListener(lightboxOpenEvent, lightboxOpened);
        });
    });
});
