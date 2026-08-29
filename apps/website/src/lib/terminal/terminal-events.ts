export const terminalOverlayOpenEvent = "terminal-overlay-open";

export const openTerminalOverlay = () => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(terminalOverlayOpenEvent));
    }
};
