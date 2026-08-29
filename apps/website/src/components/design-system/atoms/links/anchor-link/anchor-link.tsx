import type { AnchorHTMLAttributes, FC, ReactNode } from "react";

/**
 * How a link decides when to prefetch its destination. This is a hint the design system passes to
 * whatever link implementation the consumer injects — a router that cannot prefetch ignores it.
 *
 * - `"viewport"`: prefetch once the link scrolls into the viewport.
 * - `"hover"`: prefetch only once the pointer or focus reaches the link. Reserved for link-dense
 *   surfaces (archives, tag listings) where prefetching everything visible is disproportionate to
 *   the odds any one link gets clicked.
 * - `"never"`: no prefetching at all.
 */
export type PrefetchStrategy = "viewport" | "hover" | "never";

export interface LinkComponentProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
    href: string;
    children?: ReactNode;
    prefetch?: PrefetchStrategy;
}

/**
 * What the design system needs from a link renderer. Consumers inject a router-aware implementation
 * (`next/link`, a framework `<Link>`, and so on); without one, links fall back to {@link AnchorLink}.
 */
export type LinkComponent = FC<LinkComponentProps>;

/**
 * The framework-free default: a real `<a>`, which navigates correctly everywhere but without
 * client-side routing. `prefetch` is destructured away rather than spread, since it is not a DOM
 * attribute and React would warn about it.
 */
export const AnchorLink: LinkComponent = ({ href, children, prefetch: _prefetch, ...rest }) => (
    <a href={href} {...rest}>
        {children}
    </a>
);
