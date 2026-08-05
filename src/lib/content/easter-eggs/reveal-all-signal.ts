/**
 * A page-scoped broadcast that expands every EggSolution's steps at once. Deliberately separate
 * from easter-egg-found: revealing every solution is a reader convenience and must never mark
 * anything as "found" — found only ever means "you triggered it in the wild".
 */
export const revealAllSolutionsEvent = "reveal-all-easter-egg-solutions";

export const triggerRevealAllSolutions = (): void => {
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(revealAllSolutionsEvent));
    }
};

export const subscribeToRevealAllSolutions = (callback: () => void): (() => void) => {
    if (typeof window === "undefined") {
        return () => {};
    }

    window.addEventListener(revealAllSolutionsEvent, callback);
    return () => window.removeEventListener(revealAllSolutionsEvent, callback);
};
