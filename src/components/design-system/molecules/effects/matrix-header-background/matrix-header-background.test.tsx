import { describe, it, expect, vi } from "vitest";
import { render } from "@testing-library/react";
import { MatrixHeaderBackground } from "./matrix-header-background";

vi.mock("@/components/design-system/atoms/effects/matrix-rain/matrix-rain", () => ({
    MatrixRain: () => <div data-testid="matrix-rain" />,
}));

describe("MatrixHeaderBackground", () => {
    describe("render", () => {
        it("renders the MatrixRain effect", () => {
            const { getByTestId } = render(<MatrixHeaderBackground big={false} />);
            expect(getByTestId("matrix-rain")).toBeInTheDocument();
        });
    });

    describe("props", () => {
        it("applies big height classes when big is true", () => {
            const { container } = render(<MatrixHeaderBackground big={true} />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toContain("h-[350px]");
        });

        it("applies small height classes when big is false", () => {
            const { container } = render(<MatrixHeaderBackground big={false} />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.className).toContain("h-[240px]");
        });
    });
});
