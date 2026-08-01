/**
 * Declares the legacy `lunr` global that elasticlunr's own source assigns to.
 *
 * elasticlunr.js ends with a back-compat line — `lunr = elasticlunr` — that writes to an *undeclared*
 * identifier. Under esbuild's IIFE output that is strict-mode code, where assigning to an undeclared
 * identifier throws `ReferenceError: lunr is not defined`. The throw happens while the bundle is
 * initialising, so it takes down every preview card, not just CommandPalette's.
 *
 * Defining the property first makes `lunr` a resolvable global reference, so the assignment succeeds
 * and the library loads normally. This is a separate module purely for ordering: ES imports are
 * evaluated before the importing module's body, so `elasticlunr.ts` importing this first guarantees
 * the global exists before elasticlunr's own body runs.
 */
declare global {
    // eslint-disable-next-line no-var
    var lunr: unknown;
}

if (!("lunr" in globalThis)) {
    (globalThis as { lunr?: unknown }).lunr = undefined;
}

export {};
