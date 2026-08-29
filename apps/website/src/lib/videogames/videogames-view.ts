import { readLocalStorage, writeLocalStorage } from "../local-storage/local-storage";

export type VideogamesView = "consoles" | "games";

const key = "videogames_view";

export const videogamesViewChangeEvent = "videogames-view-change";

export const readVideogamesView = (): VideogamesView => {
    const saved = readLocalStorage(key);
    return saved === "consoles" || saved === "games" ? saved : "consoles";
};

export const writeVideogamesView = (value: VideogamesView) => {
    writeLocalStorage(key, value);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(videogamesViewChangeEvent));
    }
};
