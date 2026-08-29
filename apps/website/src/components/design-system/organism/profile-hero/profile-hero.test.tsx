import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProfileHero } from "./profile-hero";

vi.mock("next/image", () => ({
    default: ({ alt, src, ...rest }: React.ImgHTMLAttributes<HTMLImageElement> & { src: string }) => (
        <img alt={alt} src={src} {...rest} />
    ),
}));

describe("ProfileHero", () => {
    describe("render", () => {
        it("renders the name", () => {
            render(<ProfileHero name="Alessandro Romano" />);
            expect(screen.getByText("Alessandro Romano")).toBeInTheDocument();
        });

        it("renders the role when provided", () => {
            render(<ProfileHero name="A" role="Senior Engineer" />);
            expect(screen.getByText("Senior Engineer")).toBeInTheDocument();
        });

        it("does not render a role when absent", () => {
            render(<ProfileHero name="A" />);
            expect(screen.queryByText("Senior Engineer")).not.toBeInTheDocument();
        });

        it("renders children in the content slot", () => {
            render(
                <ProfileHero name="A">
                    <button>Jump</button>
                </ProfileHero>,
            );
            expect(screen.getByRole("button", { name: "Jump" })).toBeInTheDocument();
        });

        it("passes the image src and alt through to the photo", () => {
            render(<ProfileHero name="A" imageSrc="/media/authors/a-large.jpg" imageAlt="A photo" />);
            expect(screen.getByAltText("A photo")).toHaveAttribute("src", "/media/authors/a-large.jpg");
        });
    });
});
