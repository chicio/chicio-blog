import { describe, it, expect, vi } from "vitest";
import { render, screen, nextImageMock, motionDivMock } from "@/test-utils";
import { ArtGallery } from "./index";

vi.mock("next/image", () => nextImageMock());
vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());

describe("ArtGallery", () => {
    describe("render", () => {
        it("renders art items with descriptions", () => {
            render(<ArtGallery />);
            expect(screen.getByAltText("2024-02-07.jpg")).toBeInTheDocument();
        });

        it("renders multiple art images", () => {
            render(<ArtGallery />);
            const images = screen.getAllByRole("img");
            expect(images.length).toBeGreaterThan(0);
        });

        it("renders the first art description text", () => {
            render(<ArtGallery />);
            expect(screen.getByText(/Bowser from Super Mario Wonder/)).toBeInTheDocument();
        });
    });

    describe("modal", () => {
        it("does not render the modal initially", () => {
            render(<ArtGallery />);
            expect(screen.queryByAltText("Modal Image")).not.toBeInTheDocument();
        });
    });
});
