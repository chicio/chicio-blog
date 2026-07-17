import { describe, it, expect, vi } from "vitest";
import type { ReactNode } from "react";
import { render, screen, fireEvent } from "@/test-utils";
import { EasterEggs } from "./easter-eggs";
import {
    easterEggHints,
    easterEggHuntIntroLines,
    easterEggHuntPageDescription,
    easterEggHuntPageTitle,
} from "@/lib/content/easter-eggs/easter-eggs-content";

vi.mock("@/components/features/content/content-page", () => ({
    ContentPage: ({ children }: { children?: ReactNode }) => <div>{children}</div>,
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

describe("EasterEggs", () => {
    describe("intro", () => {
        it("renders the page title and subtitle", () => {
            render(<EasterEggs />);
            expect(
                screen.getByRole("heading", { level: 1, name: new RegExp(easterEggHuntPageTitle) }),
            ).toBeInTheDocument();
            expect(screen.getByText(easterEggHuntPageDescription)).toBeInTheDocument();
        });

        it("renders every intro line", () => {
            render(<EasterEggs />);
            easterEggHuntIntroLines.forEach((line) => {
                expect(screen.getByText(line)).toBeInTheDocument();
            });
        });
    });

    describe("egg cards", () => {
        it("renders both card titles and cryptic hints", () => {
            render(<EasterEggs />);
            easterEggHints.forEach((hint) => {
                expect(screen.getByText(new RegExp(hint.title))).toBeInTheDocument();
                expect(screen.getByText(hint.crypticHint)).toBeInTheDocument();
            });
        });

        it("does not show any solution steps before revealing", () => {
            render(<EasterEggs />);
            easterEggHints.forEach((hint) => {
                hint.solutionSteps.forEach((step) => {
                    expect(screen.queryByText(step)).not.toBeInTheDocument();
                });
            });
        });

        it("reveals the solution steps for a card when the reveal toggle is clicked", () => {
            render(<EasterEggs />);
            const [firstHint] = easterEggHints;
            const revealButtons = screen.getAllByRole("button", { name: /reveal/ });
            fireEvent.click(revealButtons[0]);
            firstHint.solutionSteps.forEach((step) => {
                expect(screen.getByText(step)).toBeInTheDocument();
            });
        });

        it("hides the solution steps again when toggled a second time", () => {
            render(<EasterEggs />);
            const [firstHint] = easterEggHints;
            const revealButtons = screen.getAllByRole("button", { name: /reveal/ });
            fireEvent.click(revealButtons[0]);
            fireEvent.click(screen.getAllByRole("button", { name: /hide/ })[0]);
            firstHint.solutionSteps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });

        it("only reveals the toggled card, leaving the other collapsed", () => {
            render(<EasterEggs />);
            const [, secondHint] = easterEggHints;
            const revealButtons = screen.getAllByRole("button", { name: /reveal/ });
            fireEvent.click(revealButtons[0]);
            secondHint.solutionSteps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });
    });
});
