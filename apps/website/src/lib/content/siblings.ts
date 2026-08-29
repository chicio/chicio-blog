import { Content } from "@/types/content/content";
import { Siblings } from "@/types/content/siblings";

/**
 * Locates a content item in an ordered list and returns it with its neighbours, which is what every
 * previous/next page navigation needs.
 *
 * Takes the list as an argument rather than hanging off a content section, so the caller decides what
 * "sibling" means for its page. The convention across the site is **siblings under the same parent**:
 * a console's siblings are all consoles, a game's siblings are the games of ITS console, a topic's
 * siblings are all topics. That choice of list is the only per-page decision; the lookup itself is
 * identical everywhere and lives here.
 *
 * Returns undefined when the slug is not in the list, so callers can 404.
 */
export const siblingsOf = <TMeta>(items: Content<TMeta>[], slug: string): Siblings<TMeta> | undefined => {
    const index = items.findIndex((item) => item.slug.formatted === slug);

    if (index === -1) {
        return undefined;
    }

    return {
        current: items[index],
        previous: items[index - 1],
        next: items[index + 1],
    };
};
