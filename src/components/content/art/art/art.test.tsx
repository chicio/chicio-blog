import { describe, it, expect, vi } from "vitest";
import type { ReactNode, FC, ComponentType } from "react";
import { render, screen, nextImageMock, motionDivMock } from "@/test-utils";
import { Art } from "./index";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));
vi.mock("next/image", () => nextImageMock());
vi.mock("@/components/design-system/atoms/animation/motion-div", () => motionDivMock());

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
}));

interface FakeArtContentProps {
    components?: {
        img?: ComponentType<{ src?: string; alt?: string }>;
        figure?: ComponentType<{ children?: ReactNode }>;
    };
}

const { FakeArtContent } = vi.hoisted(() => {
    const FakeArtContent: FC<FakeArtContentProps> = ({ components }) => {
        const Img = components?.img ?? "img";
        const Figure = components?.figure ?? "figure";

        return (
            <>
                <Figure>
                    <Img src="/media/content/art/2024-02-07.jpg" alt="Bowser from Super Mario Wonder" />
                </Figure>
                <Figure>
                    <Img src="/media/content/art/2023-10-31.jpg" alt="Giant pumpkin" />
                </Figure>
                <Figure>
                    <span>not an image, falls back to a plain figure</span>
                </Figure>
            </>
        );
    };

    return { FakeArtContent };
});

vi.mock("@/content/art/content.mdx", () => ({ default: FakeArtContent }));

describe("Art", () => {
    describe("render", () => {
        it("renders every gallery card from the MDX content", () => {
            render(<Art />);
            expect(screen.getByAltText("Bowser from Super Mario Wonder")).toBeInTheDocument();
            expect(screen.getByAltText("Giant pumpkin")).toBeInTheDocument();
        });

        it("falls back to a plain figure for a non-image figure child", () => {
            render(<Art />);
            expect(screen.getByText("not an image, falls back to a plain figure")).toBeInTheDocument();
        });

        it("does not render the modal initially", () => {
            render(<Art />);
            expect(screen.queryByAltText("Modal Image")).not.toBeInTheDocument();
        });
    });

    describe("modal", () => {
        it("opens the shared modal when a gallery card is clicked", async () => {
            render(<Art />);

            screen.getByAltText("Bowser from Super Mario Wonder").click();

            expect(await screen.findByAltText("Modal Image")).toBeInTheDocument();
        });

        it("shows the clicked image in the modal", async () => {
            render(<Art />);

            screen.getByAltText("Giant pumpkin").click();

            const modalImage = await screen.findByAltText("Modal Image");
            expect(modalImage).toHaveAttribute("src", "/media/content/art/2023-10-31.jpg");
        });
    });
});
