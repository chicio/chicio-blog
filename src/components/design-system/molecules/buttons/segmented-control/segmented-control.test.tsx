import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SegmentedControl } from "./segmented-control";

vi.mock("@/components/design-system/atoms/animation/motion-div", () => ({
    MotionDiv: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
        <div {...props}>{children}</div>
    ),
}));

describe("SegmentedControl", () => {
    const options = [
        { label: "All", value: "all" },
        { label: "Frontend", value: "frontend" },
        { label: "Backend", value: "backend" },
    ] as const;

    describe("render", () => {
        it("renders all option labels", () => {
            render(
                <SegmentedControl options={[...options]} value="all" onChange={vi.fn()} />,
            );
            expect(screen.getByText("All")).toBeInTheDocument();
            expect(screen.getByText("Frontend")).toBeInTheDocument();
            expect(screen.getByText("Backend")).toBeInTheDocument();
        });

        it("renders the correct number of buttons", () => {
            render(
                <SegmentedControl options={[...options]} value="all" onChange={vi.fn()} />,
            );
            expect(screen.getAllByRole("button")).toHaveLength(3);
        });
    });

    describe("interaction", () => {
        it("calls onChange with the selected value when a button is clicked", async () => {
            const onChange = vi.fn();
            render(
                <SegmentedControl options={[...options]} value="all" onChange={onChange} />,
            );
            await userEvent.click(screen.getByText("Frontend"));
            expect(onChange).toHaveBeenCalledOnce();
            expect(onChange).toHaveBeenCalledWith("frontend");
        });

        it("does not call onChange when the active option is clicked", async () => {
            const onChange = vi.fn();
            render(
                <SegmentedControl options={[...options]} value="all" onChange={onChange} />,
            );
            await userEvent.click(screen.getByText("All"));
            expect(onChange).toHaveBeenCalledWith("all");
        });
    });
});
