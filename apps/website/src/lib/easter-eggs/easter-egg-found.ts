import { readLocalStorage, writeLocalStorage, removeLocalStorage } from "@/lib/local-storage/local-storage";
import { isEasterEggSlug, type EasterEggSlug } from "./easter-egg-catalog";

const STORAGE_KEY = "chicio-easter-egg-hunt";

export const easterEggFoundChangeEvent = "easter-egg-found-change";

const notify = (): void => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(easterEggFoundChangeEvent));
    }
};

export const readFoundEasterEggs = (): EasterEggSlug[] => {
    try {
        const raw = readLocalStorage(STORAGE_KEY);

        if (raw === null) {
            return [];
        }

        const parsed = JSON.parse(raw) as unknown;

        return Array.isArray(parsed) ? parsed.filter(isEasterEggSlug) : [];
    } catch {
        return [];
    }
};

export const isEasterEggFound = (slug: EasterEggSlug): boolean => readFoundEasterEggs().includes(slug);

export const markEasterEggFound = (slug: EasterEggSlug): void => {
    try {
        const found = readFoundEasterEggs();

        if (found.includes(slug)) {
            return;
        }

        writeLocalStorage(STORAGE_KEY, JSON.stringify([...found, slug]));
    } catch {
        return;
    }

    notify();
};

export const resetFoundEasterEggs = (): void => {
    try {
        removeLocalStorage(STORAGE_KEY);
    } catch {
        // ignore — nothing to reset
    }

    notify();
};

export const subscribeToEasterEggFound = (callback: () => void): (() => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(easterEggFoundChangeEvent, callback);
    return () => window.removeEventListener(easterEggFoundChangeEvent, callback);
};
