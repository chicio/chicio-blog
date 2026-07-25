import { contentRegistry } from "./registry";

/**
 * Everything the site search indexes, derived from the content registry: an entry appears here exactly
 * when it declares how it is `indexed`.
 */
export const getIndexableContent = () => contentRegistry.flatMap((entry) => entry.indexed?.() ?? []);
