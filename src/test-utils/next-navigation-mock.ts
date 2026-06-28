import { vi } from "vitest";

export interface NavigationMockOptions {
    pathname?: string;
    push?: ReturnType<typeof vi.fn>;
    replace?: ReturnType<typeof vi.fn>;
    back?: ReturnType<typeof vi.fn>;
    forward?: ReturnType<typeof vi.fn>;
    prefetch?: ReturnType<typeof vi.fn>;
    searchParams?: Record<string, string>;
}

/**
 * Returns a factory function suitable for the second argument of
 * vi.mock("next/navigation", factory), giving every test a deterministic
 * routing environment with overridable defaults.
 *
 * IMPORTANT — vitest hoisting: vi.mock() calls are hoisted before imports.
 * This function must be invoked inside a factory lambda so it runs after
 * module resolution:
 *
 *   vi.mock("next/navigation", () => makeNextNavigationMock()());
 *   // — or with overrides —
 *   vi.mock("next/navigation", () => makeNextNavigationMock({ pathname: "/blog" })());
 *
 * The vi.fn() references inside the returned object are stable within a test
 * file because they are created once per module-graph resolution.
 */
export function makeNextNavigationMock(options: NavigationMockOptions = {}) {
    const {
        pathname = "/",
        push = vi.fn(),
        replace = vi.fn(),
        back = vi.fn(),
        forward = vi.fn(),
        prefetch = vi.fn(),
        searchParams = {},
    } = options;

    return () => ({
        usePathname: () => pathname,
        useRouter: () => ({ push, replace, back, forward, prefetch }),
        useSearchParams: () => new URLSearchParams(searchParams),
        useParams: () => ({}),
    });
}

/**
 * Pre-built factory for the common case (pathname = "/").
 * Use inside a vi.mock factory lambda:
 *
 *   vi.mock("next/navigation", () => defaultNextNavigationMock());
 */
export const defaultNextNavigationMock = makeNextNavigationMock();
