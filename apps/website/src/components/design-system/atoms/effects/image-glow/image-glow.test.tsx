import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ImageGlow } from "./image-glow";

vi.mock("next/image", () => ({
    default: ({
        src,
        alt,
        className,
        placeholder: _placeholder,
        blurDataURL: _blurDataURL,
        fill: _fill,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean; placeholder?: string; blurDataURL?: string }) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={String(src)} alt={alt} className={className} {...rest} />
    ),
}));

describe("ImageGlow", () => {
    describe("render", () => {
        it("renders an image with the provided src and alt", () => {
            render(<ImageGlow src="/test.jpg" alt="A test image" width={100} height={100} />);
            expect(screen.getByRole("img", { name: "A test image" })).toBeInTheDocument();
        });

        it("applies the glow-container class when className is provided", () => {
            render(<ImageGlow src="/test.jpg" alt="glow test" width={100} height={100} className="my-img" />);
            const img = screen.getByRole("img");
            expect(img).toHaveClass("glow-container");
            expect(img).toHaveClass("my-img");
        });

        it("does not apply glow-container when className is omitted", () => {
            render(<ImageGlow src="/test.jpg" alt="no glow" width={100} height={100} />);
            const img = screen.getByRole("img");
            expect(img.className).toBe("");
        });
    });

    describe("props", () => {
        it("passes width and height to the underlying image", () => {
            render(<ImageGlow src="/test.jpg" alt="sized" width={400} height={300} />);
            const img = screen.getByRole("img");
            expect(img).toHaveAttribute("width", "400");
            expect(img).toHaveAttribute("height", "300");
        });
    });
});
