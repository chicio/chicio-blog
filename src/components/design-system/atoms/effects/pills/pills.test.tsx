import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { RedPill, BluePill, RedPillNoReflection } from "./pills";

describe("Pills", () => {
    describe("RedPill", () => {
        it("renders children", () => {
            render(<RedPill>Red label</RedPill>);
            expect(screen.getByText("Red label")).toBeInTheDocument();
        });

        it("applies pill and pill-red classes", () => {
            const { container } = render(<RedPill>Red</RedPill>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("pill");
            expect(el.className).toContain("pill-red");
        });
    });

    describe("BluePill", () => {
        it("renders children", () => {
            render(<BluePill>Blue label</BluePill>);
            expect(screen.getByText("Blue label")).toBeInTheDocument();
        });

        it("applies pill and pill-blue classes", () => {
            const { container } = render(<BluePill>Blue</BluePill>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("pill");
            expect(el.className).toContain("pill-blue");
        });
    });

    describe("RedPillNoReflection", () => {
        it("renders children", () => {
            render(<RedPillNoReflection>No reflection</RedPillNoReflection>);
            expect(screen.getByText("No reflection")).toBeInTheDocument();
        });

        it("applies pill-no-reflection class", () => {
            const { container } = render(<RedPillNoReflection>No reflection</RedPillNoReflection>);
            const el = container.firstChild as HTMLElement;
            expect(el.className).toContain("pill-no-reflection");
        });

        it("applies custom pillBodyClassName and pillLabelClassName", () => {
            const { container } = render(
                <RedPillNoReflection pillBodyClassName="body-extra" pillLabelClassName="label-extra">
                    Label
                </RedPillNoReflection>,
            );
            const body = container.firstChild as HTMLElement;
            expect(body.className).toContain("body-extra");
            const label = body.querySelector(".pill-label") as HTMLElement;
            expect(label.className).toContain("label-extra");
        });
    });
});
