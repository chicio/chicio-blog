/**
 * design-sync shim for `next/navigation`.
 *
 * Used by two design-system stores: `use-command-palette-store.ts` (`useRouter().push`) and
 * `use-menu-store.ts` (`usePathname`, to mark the active nav entry). Neither can resolve outside a
 * Next.js runtime.
 *
 * The shapes here match what the repo's own tests already substitute — see the `vi.mock` blocks in
 * `command-palette.test.tsx` and `menu.test.tsx`, which return exactly `{ push }` and `"/"`.
 *
 * Navigation is intentionally inert: a preview card that navigated away on click would break the
 * card. `usePathname` returns "/" so nav components render their unselected state, which is the
 * honest default for a component browsed outside any route.
 */
export const useRouter = () => ({
    push: (_href: string) => {},
    replace: (_href: string) => {},
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: (_href: string) => {},
});

export const usePathname = () => "/";

export const useSearchParams = () => new URLSearchParams();

export const useParams = () => ({}) as Record<string, string | string[]>;

export const redirect = (_href: string): never => {
    throw new Error("design-sync shim: redirect() is not available outside Next.js");
};

export const notFound = (): never => {
    throw new Error("design-sync shim: notFound() is not available outside Next.js");
};
