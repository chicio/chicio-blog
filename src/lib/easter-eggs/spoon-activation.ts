import { matchesSpoonPhrase } from "./spoon-phrase";

export const spoonActivationEvent = "spoon-easter-egg-activate";

let pendingActivation = false;

export const activateSpoonEasterEgg = () => {
    pendingActivation = true;

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(spoonActivationEvent));
    }
};

export const consumePendingSpoonActivation = (): boolean => {
    if (!pendingActivation) {
        return false;
    }

    pendingActivation = false;
    return true;
};

export const trySpoonPhrase = (text: string): boolean => {
    if (!matchesSpoonPhrase(text)) {
        return false;
    }

    activateSpoonEasterEgg();
    return true;
};
