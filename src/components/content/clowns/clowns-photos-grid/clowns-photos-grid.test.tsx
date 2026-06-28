import { describe, it, expect, vi } from "vitest";
import { render, screen, nextImageMock } from "@/test-utils";
import { ClownsPhotosGrid } from "./index";

vi.mock("next/image", () => nextImageMock());

describe("ClownsPhotosGrid", () => {
    describe("render", () => {
        it("renders clown photo images", () => {
            render(<ClownsPhotosGrid />);
            const images = screen.getAllByRole("img");
            expect(images.length).toBeGreaterThan(0);
        });

        it("renders the expected number of displayed photos", () => {
            render(<ClownsPhotosGrid />);
            const images = screen.getAllByRole("img");
            expect(images.length).toBe(4);
        });

        it("renders images with descriptive alt text", () => {
            render(<ClownsPhotosGrid />);
            expect(screen.getByAltText("Clown Photo 1")).toBeInTheDocument();
        });
    });
});
