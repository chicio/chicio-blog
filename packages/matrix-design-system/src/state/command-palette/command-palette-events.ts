export const commandPaletteOpenEvent = "command-palette-open";

export const openCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteOpenEvent));
    }
};

export const commandPaletteCloseEvent = "command-palette-close";

/**
 * Closes every mounted palette. Items inside a palette must not use this — they close their own
 * palette through CommandPaletteContext. This exists for callers outside the palette's React tree.
 */
export const closeCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteCloseEvent));
    }
};
