import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MatrixBackground } from "./matrix-background";

vi.mock("@/components/design-system/atoms/effects/matrix-rain/matrix-rain", () => ({
    MatrixRain: () => <div data-testid="matrix-rain" />,
}));

describe("MatrixBackground", () => {
    describe("render", () => {
        it("renders children", () => {
            render(
                <MatrixBackground>
                    <p>Welcome</p>
                </MatrixBackground>,
            );
            expect(screen.getByText("Welcome")).toBeInTheDocument();
        });

        it("renders the MatrixRain effect", () => {
            render(
                <MatrixBackground>
                    <p>Content</p>
                </MatrixBackground>,
            );
            expect(screen.getByTestId("matrix-rain")).toBeInTheDocument();
        });
    });
});
