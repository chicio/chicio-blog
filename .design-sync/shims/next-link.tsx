import type { AnchorHTMLAttributes, FC, PropsWithChildren } from "react";

/**
 * design-sync shim for `next/link`.
 *
 * The design system is bundled for claude.ai/design, which has no Next.js runtime, so `next/link`
 * cannot resolve. `next/link` renders an `<a href>` — that is exactly what this returns. The repo's
 * own test suite substitutes the same thing (`src/test-utils/next-module-mocks.tsx`), so preview
 * cards render the markup the components' tests already assert against.
 *
 * Next-only props are dropped rather than spread: React warns on unknown DOM attributes, and those
 * warnings surface as `[RENDER_ERRORS]` in `package-validate.mjs`.
 */
type NextLinkProps = PropsWithChildren<
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
        href: string | { pathname?: string };
        prefetch?: boolean | null;
        replace?: boolean;
        scroll?: boolean;
        shallow?: boolean;
        passHref?: boolean;
        locale?: string | false;
        legacyBehavior?: boolean;
    }
>;

const Link: FC<NextLinkProps> = ({
    href,
    children,
    prefetch: _prefetch,
    replace: _replace,
    scroll: _scroll,
    shallow: _shallow,
    passHref: _passHref,
    locale: _locale,
    legacyBehavior: _legacyBehavior,
    ...rest
}) => (
    <a href={typeof href === "string" ? href : (href.pathname ?? "#")} {...rest}>
        {children}
    </a>
);

export default Link;
