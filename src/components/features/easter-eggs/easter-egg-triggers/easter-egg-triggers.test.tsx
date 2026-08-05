import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@/test-utils";
import { fireEvent } from "@testing-library/react";
import { EasterEggTriggers } from "./easter-egg-triggers";
import { closeEasterEgg, getEasterEggOverlaySlug } from "@/lib/easter-eggs/easter-egg-overlay-state";
import { activateSpoonEasterEgg, consumePendingSpoonActivation } from "@/lib/easter-eggs/spoon-activation";

const KONAMI_KEYS = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

const pressKonamiSequence = () => {
    KONAMI_KEYS.forEach((key) => fireEvent.keyDown(document, { key }));
};

describe("EasterEggTriggers", () => {
    beforeEach(() => {
        closeEasterEgg();
        localStorage.clear();
        consumePendingSpoonActivation();
    });

    describe("render", () => {
        it("renders an aria-hidden tap hotspot in the bottom-right corner", () => {
            render(<EasterEggTriggers />);
            const hotspot = screen.getByTestId("kung-fu-tap-hotspot");
            expect(hotspot).toHaveAttribute("aria-hidden", "true");
        });
    });

    describe("Konami sequence", () => {
        it("opens the kung-fu egg once the full sequence is pressed", () => {
            render(<EasterEggTriggers />);
            pressKonamiSequence();
            expect(getEasterEggOverlaySlug()).toBe("i-know-kung-fu");
        });

        it("does not trigger on a partial sequence", () => {
            render(<EasterEggTriggers />);
            fireEvent.keyDown(document, { key: "ArrowUp" });
            fireEvent.keyDown(document, { key: "ArrowUp" });
            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });

    describe("bottom-right tap hotspot", () => {
        it("opens the kung-fu egg after five quick taps", () => {
            render(<EasterEggTriggers />);
            const hotspot = screen.getByTestId("kung-fu-tap-hotspot");
            for (let i = 0; i < 5; i++) {
                fireEvent.click(hotspot);
            }
            expect(getEasterEggOverlaySlug()).toBe("i-know-kung-fu");
        });

        it("does not trigger before the fifth tap", () => {
            render(<EasterEggTriggers />);
            const hotspot = screen.getByTestId("kung-fu-tap-hotspot");
            for (let i = 0; i < 4; i++) {
                fireEvent.click(hotspot);
            }
            expect(getEasterEggOverlaySlug()).toBeNull();
        });
    });

    describe("spoon activation", () => {
        it("opens the spoon egg when the activation event fires", () => {
            render(<EasterEggTriggers />);
            activateSpoonEasterEgg();
            expect(getEasterEggOverlaySlug()).toBe("there-is-no-spoon");
        });

        it("drains a pending activation that fired before mount", () => {
            activateSpoonEasterEgg();
            render(<EasterEggTriggers />);
            expect(getEasterEggOverlaySlug()).toBe("there-is-no-spoon");
        });
    });

    describe("while an egg is already open", () => {
        it("ignores a new Konami match", () => {
            render(<EasterEggTriggers />);
            activateSpoonEasterEgg();
            expect(getEasterEggOverlaySlug()).toBe("there-is-no-spoon");
            pressKonamiSequence();
            expect(getEasterEggOverlaySlug()).toBe("there-is-no-spoon");
        });
    });
});
