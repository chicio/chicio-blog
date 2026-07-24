import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
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

    describe("autoPlay", () => {
        it("sets the autoPlay attribute when autoPlay is true", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" autoPlay />);
            expect(container.querySelector("video")).toHaveAttribute("autoplay");
        });

        it("does not set the autoPlay attribute when autoPlay is not provided", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" />);
            expect(container.querySelector("video")).not.toHaveAttribute("autoplay");
        });
    });

    describe("onEnded", () => {
        it("calls onEnded when the video ends event fires", () => {
            const onEnded = vi.fn();
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" onEnded={onEnded} />);
            const video = container.querySelector("video");
            if (video) {
                fireEvent.ended(video);
            }
            expect(onEnded).toHaveBeenCalledTimes(1);
        });
    });

    describe("videoRef", () => {
        it("calls videoRef with the video element on mount", () => {
            const videoRef = vi.fn();
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" videoRef={videoRef} />);
            expect(videoRef).toHaveBeenCalledWith(container.querySelector("video"));
        });
    });

    describe("ariaLabel", () => {
        it("sets aria-label on the video element when provided", () => {
            const { container } = render(<SelfHostedVideo src="/video/demo.mp4" ariaLabel="A descriptive label" />);
            expect(container.querySelector("video")).toHaveAttribute("aria-label", "A descriptive label");
        });
    });
});
