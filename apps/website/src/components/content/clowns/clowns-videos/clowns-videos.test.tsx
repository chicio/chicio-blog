import { describe, it, expect } from "vitest";
import { render, screen } from "@/test-utils";
import { ClownsVideos } from "./index";

describe("ClownsVideos", () => {
    describe("render", () => {
        it("renders iframe elements for videos", () => {
            render(<ClownsVideos />);
            const iframes = document.querySelectorAll("iframe");
            expect(iframes.length).toBeGreaterThan(0);
        });

        it("renders the expected number of displayed videos", () => {
            render(<ClownsVideos />);
            const iframes = document.querySelectorAll("iframe");
            expect(iframes.length).toBe(4);
        });

        it("renders iframes with descriptive titles", () => {
            render(<ClownsVideos />);
            const iframe = screen.getByTitle("Clown Video 1");
            expect(iframe).toBeInTheDocument();
        });

        it("renders iframes with YouTube embed sources", () => {
            render(<ClownsVideos />);
            const iframes = document.querySelectorAll("iframe");
            Array.from(iframes).forEach((iframe) => {
                expect(iframe.getAttribute("src")).toContain("youtube.com/embed");
            });
        });
    });
});
