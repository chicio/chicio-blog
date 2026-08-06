import { describe, it, expect, vi, beforeEach } from "vitest";
import type { ReactNode } from "react";
import { render, screen, fireEvent } from "@/test-utils";
import { EasterEggs } from "./easter-eggs";

vi.mock("@/lib/tracking/tracking", () => ({ trackWith: vi.fn() }));

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

const firstHint = {
    title: "The White Rabbit",
    crypticHint: "There is a place where you can search the whole site.",
    steps: ["Press cmd-K to open the command palette.", "Type 101."],
};

const secondHint = {
    title: "Déjà Vu",
    crypticHint: "A déjà vu is a glitch in the matrix.",
    steps: ["Click the page header 4 times."],
};

vi.mock("@/content/easter-egg-hunt/content.mdx", async () => {
    const { EggCard } = await import("@/components/content/easter-eggs/egg-card");
    const { EggSolution } = await import("@/components/content/easter-eggs/egg-solution");

    const FakeEasterEggHuntContent = () => (
        <>
            <EggCard title={firstHint.title} slug="the-white-rabbit">
                <p>{firstHint.crypticHint}</p>
                <EggSolution eggId="the_white_rabbit">
                    <ul>
                        {firstHint.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ul>
                </EggSolution>
            </EggCard>
            <EggCard title={secondHint.title} slug="deja-vu">
                <p>{secondHint.crypticHint}</p>
                <EggSolution eggId="deja_vu">
                    <ul>
                        {secondHint.steps.map((step) => (
                            <li key={step}>{step}</li>
                        ))}
                    </ul>
                </EggSolution>
            </EggCard>
        </>
    );

    return { default: FakeEasterEggHuntContent };
});

describe("EasterEggs", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    describe("hunt progress", () => {
        it("renders the found counter against the total number of eggs", () => {
            render(<EasterEggs />);
            expect(screen.getByText(/0 \/ 6 easter eggs found/)).toBeInTheDocument();
        });
    });

    describe("intro", () => {
        it("renders the page title and description from the MDX frontmatter", () => {
            render(<EasterEggs />);

            expect(screen.getByRole("heading", { level: 1, name: /Easter Egg Hunt/ })).toBeInTheDocument();
            expect(
                screen.getByText(
                    "Hidden secrets are scattered across this site. Follow the clues and trigger the easter eggs yourself.",
                ),
            ).toBeInTheDocument();
        });


        it("does not render an icon in the page title", () => {
            render(<EasterEggs />);

            const heading = screen.getByRole("heading", { level: 1, name: /Easter Egg Hunt/ });

            expect(heading.querySelector("svg")).not.toBeInTheDocument();
        });
    });

    const getCardRevealButtons = () =>
        screen
            .getAllByRole("button", { name: /reveal/ })
            .filter((button) => !/all solutions/.test(button.textContent ?? ""));

    describe("egg cards", () => {
        it("renders every card title and cryptic hint from the MDX body", () => {
            render(<EasterEggs />);

            [firstHint, secondHint].forEach((hint) => {
                expect(screen.getByText(new RegExp(hint.title))).toBeInTheDocument();
                expect(screen.getByText(hint.crypticHint)).toBeInTheDocument();
            });
        });

        it("does not show any solution steps before revealing", () => {
            render(<EasterEggs />);

            [firstHint, secondHint].forEach((hint) => {
                hint.steps.forEach((step) => {
                    expect(screen.queryByText(step)).not.toBeInTheDocument();
                });
            });
        });

        it("reveals the solution steps for a card when the reveal toggle is clicked", () => {
            render(<EasterEggs />);

            fireEvent.click(getCardRevealButtons()[0]);

            firstHint.steps.forEach((step) => {
                expect(screen.getByText(step)).toBeInTheDocument();
            });
        });

        it("renders the revealed solution steps as a bullet list, not a numbered list", () => {
            render(<EasterEggs />);

            fireEvent.click(getCardRevealButtons()[0]);
            const list = screen.getByText(firstHint.steps[0]).closest("ul");

            expect(list).toBeInTheDocument();
            expect(list?.tagName).toBe("UL");
        });

        it("hides the solution steps again when toggled a second time", () => {
            render(<EasterEggs />);

            fireEvent.click(getCardRevealButtons()[0]);
            fireEvent.click(screen.getAllByRole("button", { name: /hide/ })[0]);

            firstHint.steps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });

        it("only reveals the toggled card, leaving the other collapsed", () => {
            render(<EasterEggs />);

            fireEvent.click(getCardRevealButtons()[0]);

            secondHint.steps.forEach((step) => {
                expect(screen.queryByText(step)).not.toBeInTheDocument();
            });
        });
    });
});
