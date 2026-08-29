"use client";

import { EffectsStore } from "matrix-component-store";

interface AboutMeTableOfContentsEffects {
    scrollToSection: (id: string) => () => void;
}

export const useAboutMeTableOfContentsStore = (): EffectsStore<AboutMeTableOfContentsEffects> => {
    const scrollToSection = (id: string) => () => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return {
        effects: { scrollToSection },
    };
};
