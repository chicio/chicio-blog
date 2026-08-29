import type { EasterEggSlug } from "./easter-egg-catalog";

type EasterEggOverlayListener = () => void;

let activeSlug: EasterEggSlug | null = null;
const listeners = new Set<EasterEggOverlayListener>();

const notify = (): void => {
    listeners.forEach((listener) => listener());
};

export const openEasterEgg = (slug: EasterEggSlug): void => {
    activeSlug = slug;
    notify();
};

export const closeEasterEgg = (): void => {
    activeSlug = null;
    notify();
};

export const getEasterEggOverlaySlug = (): EasterEggSlug | null => activeSlug;

export const subscribeToEasterEggOverlay = (listener: EasterEggOverlayListener): (() => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};
