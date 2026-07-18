import { describe, it, expect } from "vitest";
import { easterEggHuntMarkdown } from "./easter-egg-hunt-markdown";
import { easterEggHints, easterEggHuntIntroLines, easterEggHuntPageTitle } from "./easter-eggs-content";

describe("easterEggHuntMarkdown", () => {
    it("starts with the page title as a top-level heading", () => {
        const markdown = easterEggHuntMarkdown();

        expect(markdown.startsWith(`# ${easterEggHuntPageTitle}`)).toBe(true);
    });

    it("includes the site URL for the easter egg hunt page", () => {
        const markdown = easterEggHuntMarkdown();

        expect(markdown).toContain("**URL:**");
        expect(markdown).toContain("/easter-egg-hunt");
    });

    it("includes every intro line", () => {
        const markdown = easterEggHuntMarkdown();

        easterEggHuntIntroLines.forEach((line) => {
            expect(markdown).toContain(line);
        });
    });

    it("includes each egg's title as a second-level heading", () => {
        const markdown = easterEggHuntMarkdown();

        easterEggHints.forEach((hint) => {
            expect(markdown).toContain(`## ${hint.title}`);
        });
    });

    it("includes each egg's cryptic hint", () => {
        const markdown = easterEggHuntMarkdown();

        easterEggHints.forEach((hint) => {
            expect(markdown).toContain(hint.crypticHint);
        });
    });

    it("includes every solution step for every egg, numbered in order", () => {
        const markdown = easterEggHuntMarkdown();

        easterEggHints.forEach((hint) => {
            hint.solutionSteps.forEach((step, index) => {
                expect(markdown).toContain(`${index + 1}. ${step}`);
            });
        });
    });
});
