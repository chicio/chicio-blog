import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { SelfHostedVideo } from "./self-hosted-video";

describe("SelfHostedVideo", () => {
    describe("render", () => {
        it("renders a video element", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" />);
            expect(container.querySelector("video")).toBeInTheDocument();
        });

        it("appends #t=0.1 to src when no poster and no fragment", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" />);
            const source = container.querySelector("source");
            expect(source).toHaveAttribute("src", "/video/demo.mp4#t=0.1");
        });

        it("does not append #t=0.1 when src already contains a fragment", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4#t=5" />);
            const source = container.querySelector("source");
            expect(source).toHaveAttribute("src", "/video/demo.mp4#t=5");
        });

        it("does not append #t=0.1 when poster is provided", () => {
            const { container } = render(
                <SelfHostedVideo src="/video/demo.mp4" poster="/img/poster.jpg" />,
            );
            const source = container.querySelector("source");
            expect(source).toHaveAttribute("src", "/video/demo.mp4");
        });

        it("renders caption in a figcaption when provided", () => {
            render(<SelfHostedVideo src="/video/demo.mp4" caption="My video caption" />);
            expect(screen.getByText("My video caption")).toBeInTheDocument();
        });

        it("does not render figcaption when caption is not provided", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" />);
            expect(container.querySelector("figcaption")).toBeNull();
        });
    });
});
