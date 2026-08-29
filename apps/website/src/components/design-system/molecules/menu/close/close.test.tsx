import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Close } from "./close";

describe("Close", () => {
    describe("render", () => {
        it("renders an SVG icon element", () => {
            const { container } = render(<Close onClick={vi.fn()} />);
            expect(container.querySelector("svg")).toBeInTheDocument();
        });
    });

    describe("interaction", () => {
        it("calls onClick when the icon is clicked", async () => {
            const onClick = vi.fn();
            const { container } = render(<Close onClick={onClick} />);
            await userEvent.click(container.querySelector("svg")!);
            expect(onClick).toHaveBeenCalledOnce();
        });
    });
});
