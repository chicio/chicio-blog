/**
 * A tiny module-scope registry for the "app root" DOM node — the wrapper
 * around the real page content, rendered by AppRootBoundary in the root
 * layout. The terminal overlay toggles `inert`/`aria-hidden` on this node
 * while open, so the background page is unreachable by mouse, keyboard, or
 * assistive tech (the modal a11y contract).
 *
 * A registry (rather than document.querySelector) keeps DOM access behind a
 * ref set by the owning component's effect, consistent with the project's
 * "hold refs in state/module scope, never query the DOM ad hoc" convention —
 * this is the one place a ref legitimately needs to cross two unrelated
 * component subtrees (the page content vs. the globally-mounted overlay).
 */
let appRootElement: HTMLElement | null = null;

export const registerAppRootElement = (element: HTMLElement | null): void => {
    appRootElement = element;
};

export const getAppRootElement = (): HTMLElement | null => appRootElement;
