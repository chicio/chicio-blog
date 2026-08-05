import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Youtube } from "./youtube";

describe("Youtube", () => {
    describe("render", () => {
        it("renders an iframe whose src contains the given videoId", () => {
            render(<Youtube videoId="abc123" />);
            const iframe = screen.getByTitle("YouTube video");
            expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/abc123");
        });

        it("uses the provided title as the accessible name when passed", () => {
            render(<Youtube videoId="abc123" title="Console startup sequence" />);
            expect(screen.getByTitle("Console startup sequence")).toBeInTheDocument();
        });

        it("falls back to the default title when title is omitted", () => {
            render(<Youtube videoId="abc123" />);
            expect(screen.getByTitle("YouTube video")).toBeInTheDocument();
        });
    });
});
