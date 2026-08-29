export const commandPaletteOpenEvent = "command-palette-open";

export const openCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteOpenEvent));
    }
};

export const commandPaletteCloseEvent = "command-palette-close";

export const closeCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteCloseEvent));
    }
};
