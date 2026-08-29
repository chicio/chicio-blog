import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ImageCarousel } from "./image-carousel";

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

vi.mock("@/components/design-system/atoms/effects/image-glow", () => ({
    ImageGlow: ({
        alt,
        src,
        onClick,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} onClick={onClick} {...rest} />
    ),
}));

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

vi.mock("@/components/design-system/atoms/effects/image-shimmer-placeholder", () => ({
    imageShimmerPlaceholder: "blur",
}));

const singleImage = ["/photo.jpg"];
const multipleImages = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

describe("ImageCarousel", () => {
    describe("single image", () => {
        it("renders the image with correct alt text", () => {
            render(<ImageCarousel images={singleImage} alt="My Photo" />);
            expect(screen.getByAltText("My Photo")).toBeInTheDocument();
        });

        it("renders the caption when provided", () => {
            render(<ImageCarousel images={singleImage} alt="My Photo" caption="A beautiful scene" />);
            expect(screen.getByText("A beautiful scene")).toBeInTheDocument();
        });

        it("does not render navigation buttons for a single image", () => {
            render(<ImageCarousel images={singleImage} alt="My Photo" />);
            expect(screen.queryByRole("button", { name: "Previous image" })).toBeNull();
            expect(screen.queryByRole("button", { name: "Next image" })).toBeNull();
        });
    });

    describe("multiple images", () => {
        it("renders navigation buttons", () => {
            render(<ImageCarousel images={multipleImages} alt="Gallery" />);
            expect(screen.getByRole("button", { name: "Previous image" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Next image" })).toBeInTheDocument();
        });

        it("renders page indicator buttons", () => {
            render(<ImageCarousel images={multipleImages} alt="Gallery" />);
            expect(screen.getByRole("button", { name: "Go to image 1" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Go to image 2" })).toBeInTheDocument();
        });
    });

    describe("fullscreen", () => {
        it("opens fullscreen modal when single image is clicked", async () => {
            render(<ImageCarousel images={singleImage} alt="My Photo" />);
            const img = screen.getByAltText("My Photo");
            await userEvent.click(img);
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });
});
