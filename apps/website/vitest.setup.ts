import "@testing-library/jest-dom/vitest";

/**
 * jsdom implements no IntersectionObserver, and design-system components use it through
 * useInView / useInViewList. Before the design system became a package these tests reached in and
 * mocked those hooks; a package's internals are not reachable, so the environment provides the API
 * instead. The stub never reports an intersection, which is the "not yet visible" initial state
 * every consumer already handles.
 */
class NoopIntersectionObserver implements IntersectionObserver {
    readonly root: Element | Document | null = null;
    readonly rootMargin: string = "";
    readonly thresholds: ReadonlyArray<number> = [];
    disconnect(): void {}
    observe(): void {}
    unobserve(): void {}
    takeRecords(): IntersectionObserverEntry[] {
        return [];
    }
}

globalThis.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver;
window.IntersectionObserver = NoopIntersectionObserver as unknown as typeof IntersectionObserver;
