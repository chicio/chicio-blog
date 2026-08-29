import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { Art } from "./index";
import { lightboxOpenEvent } from "matrix-design-system";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

vi.mock("@/content/art/content.mdx", async () => {
    const { LightboxImage } = await import("matrix-design-system");

    const FakeArtContent = () => (
        <>
            <figure>
                <LightboxImage src="/media/content/art/2024-02-07.jpg" alt="Bowser from Super Mario Wonder" />
                <figcaption>Bowser from Super Mario Wonder</figcaption>
            </figure>
            <figure>
                <LightboxImage src="/media/content/art/2023-10-31.jpg" alt="Giant pumpkin" />
                <figcaption>Giant pumpkin</figcaption>
            </figure>
        </>
    );

    return { default: FakeArtContent };
});

describe("Art", () => {
    describe("render", () => {
        it("renders every gallery image from the MDX content", () => {
            render(<Art />);
            expect(screen.getByAltText("Bowser from Super Mario Wonder")).toBeInTheDocument();
            expect(screen.getByAltText("Giant pumpkin")).toBeInTheDocument();
        });

        it("renders a caption under each image", () => {
            render(<Art />);
            expect(screen.getAllByText("Giant pumpkin").length).toBeGreaterThan(0);
        });
    });

    describe("lightbox", () => {
        it("opens the shared lightbox when a gallery image is clicked", async () => {
            const lightboxOpened = vi.fn();
            window.addEventListener(lightboxOpenEvent, lightboxOpened);
            const user = userEvent.setup();
            render(<Art />);

            await user.click(screen.getByAltText("Giant pumpkin"));

            expect(lightboxOpened).toHaveBeenCalledTimes(1);
            expect(lightboxOpened.mock.calls[0][0].detail).toEqual({
                src: "/media/content/art/2023-10-31.jpg",
                alt: "Giant pumpkin",
            });
            window.removeEventListener(lightboxOpenEvent, lightboxOpened);
        });
    });
});
