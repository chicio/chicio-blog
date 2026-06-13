export const commandPaletteOpenEvent = "command-palette-open";

export const openCommandPalette = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(commandPaletteOpenEvent));
    }
};

export const matrixRainPanelOpenEvent = "matrix-rain-panel-open";

export const openMatrixRainPanel = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(matrixRainPanelOpenEvent));
    }
};
