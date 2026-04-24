export const commandPaletteOpenEvent = "command-palette-open";

export const openCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteOpenEvent));
    }
};
