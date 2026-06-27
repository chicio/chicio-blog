import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PageIndicators } from "./page-indicators";

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

describe("PageIndicators", () => {
    describe("render", () => {
        it("renders a button for each image", () => {
            render(<PageIndicators images={images} currentIndex={0} onSelect={vi.fn()} />);
            expect(screen.getByRole("button", { name: "Go to image 1" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Go to image 2" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Go to image 3" })).toBeInTheDocument();
        });

        it("marks the current index button as active", () => {
            render(<PageIndicators images={images} currentIndex={1} onSelect={vi.fn()} />);
            const activeBtn = screen.getByRole("button", { name: "Go to image 2" });
            expect(activeBtn.className).toContain("bg-primary");
        });
    });

    describe("interaction", () => {
        it("calls onSelect with correct index when a button is clicked", async () => {
            const onSelect = vi.fn();
            render(<PageIndicators images={images} currentIndex={0} onSelect={onSelect} />);
            await userEvent.click(screen.getByRole("button", { name: "Go to image 2" }));
            expect(onSelect).toHaveBeenCalledWith(1);
        });
    });
});
