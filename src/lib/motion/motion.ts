import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

const key = "motion";

const readMotion = () => readLocalStorage(key);

export const motionChangeEvent = "motion-change";

export const hasMotion = () => {
    const motionSetting = readMotion();
    return motionSetting === null || motionSetting === "on";
};

export const writeMotion = (value: "on" | "off") => {
    writeLocalStorage(key, value);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(motionChangeEvent));
    }
};
