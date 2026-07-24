import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import userEvent from "@testing-library/user-event";
import { LightboxImage } from "./index";

const { openLightboxMock } = vi.hoisted(() => ({ openLightboxMock: vi.fn() }));

vi.mock("@/components/design-system/state/lightbox/lightbox-events", () => ({
    openLightbox: openLightboxMock,
}));

describe("LightboxImage", () => {
    describe("render", () => {
        it("renders the image with alt text, src and lazy-loading attributes", () => {
            render(<LightboxImage src="/media/content/blog/example.png" alt="An example" />);

            const img = screen.getByAltText("An example");
            expect(img).toHaveAttribute("src", "/media/content/blog/example.png");
            expect(img).toHaveAttribute("loading", "lazy");
            expect(img).toHaveAttribute("decoding", "async");
        });

        it("falls back to an empty alt when none is provided", () => {
            const { container } = render(<LightboxImage src="/media/content/blog/example.png" />);
            expect(container.querySelector("img")).toHaveAttribute("alt", "");
        });

        it("renders the image inside a button trigger", () => {
            render(<LightboxImage src="/media/content/blog/example.png" alt="An example" />);
            expect(screen.getByRole("button", { name: "An example" })).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("opens the lightbox with the image src and alt on click", async () => {
            const user = userEvent.setup();
            render(<LightboxImage src="/media/content/blog/example.png" alt="An example" />);

            await user.click(screen.getByAltText("An example"));

            expect(openLightboxMock).toHaveBeenCalledWith({
                src: "/media/content/blog/example.png",
                alt: "An example",
            });
        });

        it("opens the lightbox on Enter when the trigger is focused", async () => {
            const user = userEvent.setup();
            render(<LightboxImage src="/media/content/blog/example.png" alt="An example" />);

            screen.getByRole("button", { name: "An example" }).focus();
            await user.keyboard("{Enter}");

            expect(openLightboxMock).toHaveBeenCalledWith({
                src: "/media/content/blog/example.png",
                alt: "An example",
            });
        });
    });
});
