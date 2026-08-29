import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RoundedIcon } from "./rounded-icon";

describe("RoundedIcon", () => {
    describe("render", () => {
        it("renders children inside the icon container", () => {
            render(<RoundedIcon><span>icon</span></RoundedIcon>);
            expect(screen.getByText("icon")).toBeInTheDocument();
        });

        it("applies bg-accent and rounded-full classes", () => {
            const { container } = render(<RoundedIcon>x</RoundedIcon>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("bg-accent");
            expect(el.className).toContain("rounded-full");
        });

        it("appends a custom className", () => {
            const { container } = render(<RoundedIcon className="custom">x</RoundedIcon>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("custom");
        });
    });
});
