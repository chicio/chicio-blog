import { render as rtlRender } from "@testing-library/react";
import { type RenderOptions, type RenderResult } from "@testing-library/react";
import { type ReactElement } from "react";

export * from "@testing-library/react";

/**
 * Custom render that acts as the single import point for all features/ and content/ component
 * tests. It re-exports the full RTL API so tests never need to import from
 * @testing-library/react directly.
 *
 * There are no shared React context providers in this app — cross-component state lives in
 * useSyncExternalStore stores — so the wrapper is a thin pass-through today. Its value is
 * centralising the import and providing a stable extension point.
 */
export function render(ui: ReactElement, options?: RenderOptions): RenderResult {
    return rtlRender(ui, options);
}
