import { contentRegistry } from "./registry";

/**
 * Everything the site search indexes: the content of every registry entry that declares itself
 * searchable.
 */
export const getIndexableContent = () =>
    contentRegistry.filter((entry) => entry.searchable).flatMap((entry) => entry.content?.() ?? []);
