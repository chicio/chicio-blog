import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { FullscreenModal } from "./fullscreen-modal";

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; fill?: boolean }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
}));

const images = ["/img1.jpg", "/img2.jpg", "/img3.jpg"];

describe("FullscreenModal", () => {
    describe("render", () => {
        it("renders a dialog with aria-modal", () => {
            render(<FullscreenModal images={images} currentIndex={0} onClose={vi.fn()} alt="Gallery" />);
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
        });

        it("renders a close button", () => {
            render(<FullscreenModal images={images} currentIndex={0} onClose={vi.fn()} alt="Gallery" />);
            expect(screen.getByRole("button", { name: "Close fullscreen" })).toBeInTheDocument();
        });

        it("renders navigation buttons for multiple images", () => {
            render(<FullscreenModal images={images} currentIndex={0} onClose={vi.fn()} alt="Gallery" />);
            expect(screen.getByRole("button", { name: "Previous image" })).toBeInTheDocument();
            expect(screen.getByRole("button", { name: "Next image" })).toBeInTheDocument();
        });

        it("renders all images", () => {
            render(<FullscreenModal images={images} currentIndex={0} onClose={vi.fn()} alt="Photo" />);
            expect(screen.getByAltText("Photo - Image 1")).toBeInTheDocument();
            expect(screen.getByAltText("Photo - Image 2")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClose when close button is clicked", async () => {
            const onClose = vi.fn();
            render(<FullscreenModal images={images} currentIndex={0} onClose={onClose} alt="Gallery" />);
            await userEvent.click(screen.getByRole("button", { name: "Close fullscreen" }));
            expect(onClose).toHaveBeenCalled();
        });

        it("calls onClose when Escape key is pressed", () => {
            const onClose = vi.fn();
            render(<FullscreenModal images={images} currentIndex={0} onClose={onClose} alt="Gallery" />);
            const dialog = screen.getByRole("dialog");
            fireEvent.keyDown(dialog, { key: "Escape" });
            expect(onClose).toHaveBeenCalledOnce();
        });

        it("navigates to next image when ArrowRight is pressed", () => {
            const onNavigate = vi.fn();
            render(
                <FullscreenModal
                    images={images}
                    currentIndex={0}
                    onClose={vi.fn()}
                    onNavigate={onNavigate}
                    alt="Gallery"
                />,
            );
            const dialog = screen.getByRole("dialog");
            fireEvent.keyDown(dialog, { key: "ArrowRight" });
            expect(onNavigate).toHaveBeenCalledWith(1);
        });

        it("navigates to previous image when ArrowLeft is pressed", () => {
            const onNavigate = vi.fn();
            render(
                <FullscreenModal
                    images={images}
                    currentIndex={1}
                    onClose={vi.fn()}
                    onNavigate={onNavigate}
                    alt="Gallery"
                />,
            );
            const dialog = screen.getByRole("dialog");
            fireEvent.keyDown(dialog, { key: "ArrowLeft" });
            expect(onNavigate).toHaveBeenCalledWith(0);
        });
    });
});
