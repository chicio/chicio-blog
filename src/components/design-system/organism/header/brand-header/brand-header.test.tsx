import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { BrandHeader } from "./brand-header";

vi.mock("@/components/design-system/molecules/effects/matrix-header-background", () => ({
    MatrixHeaderBackground: () => <div data-testid="matrix-header-background" />,
}));

vi.mock("@/components/design-system/atoms/effects/image-glow", () => ({
    ImageGlow: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => <img alt={alt} src={src} {...rest} />,
}));

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => <img alt={alt} src={src} {...rest} />,
}));

describe("BrandHeader", () => {
    describe("render", () => {
        it("renders the site title", () => {
            render(<BrandHeader big={false} />);
            expect(screen.getByText(/CHICIO CODING/)).toBeInTheDocument();
        });

        it("renders the site tagline", () => {
            render(<BrandHeader big={false} />);
            expect(screen.getByText(/Pixels\. Code\. Unplugged\./)).toBeInTheDocument();
        });

        it("renders the logo image", () => {
            render(<BrandHeader big={false} />);
            expect(screen.getByAltText("blog logo")).toBeInTheDocument();
        });

        it("accepts a custom wrapper component", () => {
            const Wrapper = ({ children }: React.PropsWithChildren) => (
                <div data-testid="custom-wrapper">{children}</div>
            );
            render(<BrandHeader big={false} wrapper={Wrapper} />);
            expect(screen.getByTestId("custom-wrapper")).toBeInTheDocument();
        });
    });
});
