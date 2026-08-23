/**
 * How an `InternalLink` decides when to prefetch its destination.
 *
 * Every route on this site is statically prerendered (all dynamic routes have
 * `generateStaticParams`, no dynamic APIs, content read synchronously at module scope). Per
 * Next.js docs, without Cache Components a static route is prefetched IN FULL from the CDN, so a
 * prefetched click costs no server round trip at all. That makes prefetching cheap enough to
 * default to on, but the cost is charged per link that scrolls into view (or is rendered, for
 * `CallToActionInternalWithTracking`), so link-dense surfaces opt down to `"hover"`.
 *
 * - `"viewport"`: Next.js' own default. Prefetch once the link scrolls into the viewport.
 * - `"hover"`: prefetch only once the pointer reaches the link, restoring Next's default at that
 *   point. Reserved for pages rendering dozens of links (the blog archive, tag chip listings)
 *   where prefetching every visible link is disproportionate to the odds it gets clicked.
 * - `"never"`: no prefetching at all.
 */
export type PrefetchStrategy = "viewport" | "hover" | "never";
