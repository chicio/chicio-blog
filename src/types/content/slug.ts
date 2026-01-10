/**
 * Fabrizio Duroni
 * Generic slug type for all content types
 */

/**
 * Generic slug type that works with any route structure.
 * Replaces specific types like PostSlug with a unified approach.
 */
export type Slug = {
    /** Dynamic route parameters (e.g., {year: '2025', month: '01', day: '03', slug: 'my-post'}) */
    params: Record<string, string>;
    /** Full formatted URL path (e.g., '/blog/post/2025/01/03/my-post') */
    formatted: string;
};
