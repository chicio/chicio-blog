import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Youtube } from "./youtube";

describe("Youtube", () => {
    describe("render", () => {
        it("renders an iframe with the correct src", () => {
            const { container } = render(<Youtube videoId="dQw4w9WgXcQ" />);
            const iframe = container.querySelector("iframe");
            expect(iframe).toBeInTheDocument();
            expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/dQw4w9WgXcQ");
        });

        it("renders the iframe with allowFullScreen", () => {
            const { container } = render(<Youtube videoId="abc123" />);
            const iframe = container.querySelector("iframe");
            expect(iframe).toBeInTheDocument();
        });
    });
});
