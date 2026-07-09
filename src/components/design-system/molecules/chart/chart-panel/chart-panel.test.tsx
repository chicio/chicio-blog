import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ChartPanel } from "./index";

describe("ChartPanel", () => {
    describe("render", () => {
        it("renders its children", () => {
            render(
                <ChartPanel>
                    <div data-testid="panel-body">chart</div>
                </ChartPanel>,
            );

            expect(screen.getByTestId("panel-body")).toBeInTheDocument();
        });

        it("renders a heading and description when a title is given", () => {
            render(
                <ChartPanel
                    title="Posts per year"
                    description="How the blog has grown."
                >
                    <div>chart</div>
                </ChartPanel>,
            );

            expect(screen.getByRole("heading", { level: 2, name: "Posts per year" })).toBeInTheDocument();
            expect(screen.getByText("How the blog has grown.")).toBeInTheDocument();
        });

        it("renders no heading when no title is given (bare card)", () => {
            render(
                <ChartPanel>
                    <div>chart</div>
                </ChartPanel>,
            );

            expect(screen.queryByRole("heading")).not.toBeInTheDocument();
        });
    });
});
