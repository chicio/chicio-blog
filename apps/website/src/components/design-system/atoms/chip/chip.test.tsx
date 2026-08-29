import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Chip } from "./chip";

describe("Chip", () => {
    describe("render", () => {
        it("renders its children", () => {
            render(<Chip>3 posts</Chip>);
            expect(screen.getByText("3 posts")).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("applies the small text class by default", () => {
            render(<Chip>x</Chip>);
            expect(screen.getByText("x")).toHaveClass("text-sm");
        });

        it("applies the large text class when big is true", () => {
            render(<Chip big>x</Chip>);
            expect(screen.getByText("x")).toHaveClass("text-2xl");
        });

        it("appends a custom className", () => {
            render(<Chip className="mt-1">x</Chip>);
            expect(screen.getByText("x")).toHaveClass("mt-1");
        });
    });
});
