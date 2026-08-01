/**
 * design-sync shim for `next/dist/shared/lib/get-img-props`.
 *
 * `image-shimmer-placeholder.tsx` imports `PlaceholderValue` from this deep Next internal to type the
 * shimmer data-URI it hands to `next/image`. esbuild usually elides a type-only binding, but the
 * import is written with value syntax (`import { PlaceholderValue } from …`), so the specifier can
 * still reach the resolver. This keeps it resolvable without pulling Next's internals into the bundle.
 *
 * Kept structurally identical to the shim in `next-image.tsx` so the two agree.
 */
export type PlaceholderValue = "blur" | "empty" | `data:image/${string}`;

export type OnLoadingComplete = (img: HTMLImageElement) => void;
