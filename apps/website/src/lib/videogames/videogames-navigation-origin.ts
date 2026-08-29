import { readSessionStorage, writeSessionStorage } from "../session-storage/session-storage";
import { VideogamesNavigationOrigin } from "@/types/content/videogames";

const key = "videogames_navigation_origin";

export const videogamesNavigationOriginChangeEvent = "videogames-navigation-origin-change";

export const readVideogamesNavigationOrigin = (): VideogamesNavigationOrigin | null => {
    const saved = readSessionStorage(key);
    return saved === "all-games" || saved === "console" ? saved : null;
};

export const writeVideogamesNavigationOrigin = (value: VideogamesNavigationOrigin) => {
    writeSessionStorage(key, value);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(videogamesNavigationOriginChangeEvent));
    }
};
