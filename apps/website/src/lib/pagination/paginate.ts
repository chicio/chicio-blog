import { Page } from "@/types/content/pagination";

/**
 * Slices an already-ordered list into a single 1-based page.
 *
 * Deliberately NOT a member of a content section: taking the items as an argument lets it paginate
 * a whole section (`paginate(posts.list(), ...)`) or any derived list (`paginate(getPostsForTag(tag),
 * ...)`) with the same call. It owns only the arithmetic — the URL scheme and any layout grouping
 * stay with the caller, since those are per-section presentation.
 *
 * Returns undefined for an out-of-range page so callers can 404 rather than render an empty page.
 */
export const paginate = <T>(items: T[], page: number, itemsPerPage: number): Page<T> | undefined => {
    const totalPages = Math.ceil(items.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        return undefined;
    }

    const start = (page - 1) * itemsPerPage;

    return {
        items: items.slice(start, start + itemsPerPage),
        page,
        totalPages,
        hasPrevious: page > 1,
        hasNext: page < totalPages,
    };
};
