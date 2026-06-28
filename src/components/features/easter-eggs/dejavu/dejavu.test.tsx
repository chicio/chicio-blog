import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/test-utils";
import { nextImageMock } from "@/test-utils";
import { fireEvent, act } from "@testing-library/react";
import { DejavuEasterEgg } from "./dejavu";

vi.mock("next/image", () => nextImageMock());

vi.mock("@/components/design-system/atoms/effects/overlay", () => ({
    Overlay: ({ children }: React.PropsWithChildren) => <div data-testid="overlay">{children}</div>,
}));

vi.mock("@/components/design-system/molecules/effects/matrix-terminal", () => ({
    MatrixTerminal: () => <div data-testid="matrix-terminal" />,
}));

vi.mock("@/components/features/easter-eggs/center-container", () => ({
    CenterContainer: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

describe("DejavuEasterEgg", () => {
    describe("initial state", () => {
        it("renders children without showing the overlay", () => {
            render(
                <DejavuEasterEgg>
                    <span>child content</span>
                </DejavuEasterEgg>,
            );
            expect(screen.getByText("child content")).toBeInTheDocument();
            expect(screen.queryByTestId("overlay")).toBeNull();
        });
    });

    describe("after 4 logo clicks", () => {
        it("shows the dejavu overlay once the glitch timeout fires", async () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }

            await act(async () => {
                vi.advanceTimersByTime(400);
            });

            expect(screen.getByTestId("overlay")).toBeInTheDocument();
            vi.useRealTimers();
        });

        it("hides the overlay after the reset timeout", async () => {
            vi.useFakeTimers();
            const { container } = render(<DejavuEasterEgg />);
            const wrapper = container.firstChild as HTMLElement;

            for (let i = 0; i < 4; i++) {
                fireEvent.click(wrapper);
            }

            await act(async () => {
                vi.advanceTimersByTime(400);
            });
            expect(screen.getByTestId("overlay")).toBeInTheDocument();

            await act(async () => {
                vi.advanceTimersByTime(4000);
            });
            expect(screen.queryByTestId("overlay")).toBeNull();
            vi.useRealTimers();
        });
    });
});
