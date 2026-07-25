import { matchesSpoonPhrase } from "./spoon-phrase";

export const spoonActivationEvent = "spoon-easter-egg-activate";

export const activateSpoonEasterEgg = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(spoonActivationEvent));
    }
};

export const trySpoonPhrase = (text: string): boolean => {
    if (!matchesSpoonPhrase(text)) {
        return false;
    }

    activateSpoonEasterEgg();
    return true;
};
