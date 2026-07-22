import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import type { PropsWithChildren } from "react";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { KungFuEasterEgg } from "./kung-fu-easter-egg";
import { KONAMI_SEQUENCE } from "@/lib/easter-eggs/konami-sequence";
import { trackWith } from "@/lib/tracking/tracking";
import { tracking } from "@/types/configuration/tracking";

const playMock = vi.fn().mockResolvedValue(undefined);

beforeAll(() => {
    globalThis.Audio = class {
        play() {
            return playMock();
        }
    } as unknown as typeof Audio;
});

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

vi.mock("@/components/design-system/atoms/effects/overlay", () => ({
    Overlay: ({ children, onClick }: PropsWithChildren<{ onClick?: () => void }>) => (
        <div data-testid="overlay" onClick={onClick}>
            {children}
        </div>
    ),
}));

vi.mock("@/components/design-system/molecules/effects/matrix-terminal", () => ({
    MatrixTerminal: ({ lines }: { lines: { text: string }[] }) => (
        <div data-testid="matrix-terminal">
            {lines.map((line) => (
                <p key={line.text}>{line.text}</p>
            ))}
        </div>
    ),
}));

vi.mock("@/components/features/easter-eggs/center-container", () => ({
    CenterContainer: ({ children }: PropsWithChildren) => <div>{children}</div>,
}));

const typeKonamiSequence = () => {
    KONAMI_SEQUENCE.forEach((key) => {
        fireEvent.keyDown(document, { key });
    });
};

describe("KungFuEasterEgg", () => {
    beforeEach(() => {
        vi.mocked(trackWith).mockClear();
        playMock.mockClear();
    });

    describe("before the Konami code is typed", () => {
        it("renders nothing", () => {
            render(<KungFuEasterEgg />);
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });

        it("does not activate on an unrelated key sequence", () => {
            render(<KungFuEasterEgg />);
            fireEvent.keyDown(document, { key: "ArrowUp" });
            fireEvent.keyDown(document, { key: "ArrowLeft" });
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });
    });

    describe("after the Konami code is typed", () => {
        it("shows the overlay with the kung fu terminal sequence", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            expect(screen.getByTestId("overlay")).toBeInTheDocument();
            expect(screen.getByText("I know kung fu.")).toBeInTheDocument();
        });

        it("plays the kung fu audio once", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            expect(playMock).toHaveBeenCalledTimes(1);
        });

        it("tracks the activation exactly once under the easter_egg_hunt category", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            expect(trackWith).toHaveBeenCalledTimes(1);
            expect(trackWith).toHaveBeenCalledWith({
                category: tracking.category.easter_egg_hunt,
                label: "i_know_kung_fu",
                action: tracking.action.easter_egg_konami,
            });
        });

        it("dismisses the overlay when clicked", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            fireEvent.click(screen.getByTestId("overlay"));
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });

        it("dismisses the overlay on Escape", () => {
            render(<KungFuEasterEgg />);
            typeKonamiSequence();
            fireEvent.keyDown(document, { key: "Escape" });
            expect(screen.queryByTestId("overlay")).not.toBeInTheDocument();
        });
    });
});
