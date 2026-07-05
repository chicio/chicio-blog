import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfilePhoto } from "./profile-photo";

vi.mock("next/image", () => ({
    default: ({
        alt,
        src,
        width,
        height,
        ...rest
    }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} width={width} height={height} {...rest} />
    ),
}));

describe("ProfilePhoto", () => {
    describe("render", () => {
        it("renders an image with the author as alt text", () => {
            render(<ProfilePhoto author="Fabrizio Duroni" />);
            const img = screen.getByAltText("Fabrizio Duroni");
            expect(img).toBeInTheDocument();
        });

        it("renders the author photo path", () => {
            render(<ProfilePhoto author="Fabrizio" />);
            const img = screen.getByAltText("Fabrizio");
            expect(img).toHaveAttribute("src", expect.stringContaining("fabrizio-duroni"));
        });

        it("renders a provided src", () => {
            render(
                <ProfilePhoto
                    author="Alessandro Romano"
                    src="/media/authors/alessandro-romano-large.jpg"
                />,
            );
            expect(screen.getByAltText("Alessandro Romano")).toHaveAttribute(
                "src",
                "/media/authors/alessandro-romano-large.jpg",
            );
        });
    });
});
