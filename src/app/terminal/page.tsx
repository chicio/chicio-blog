import { createMetadata } from "@/lib/seo/seo";
import { siteMetadata } from "@/types/configuration/site-metadata";
import { slugs } from "@/types/configuration/slug";

export const metadata = {
    ...createMetadata({
        author: siteMetadata.author,
        title: `Terminal | ${siteMetadata.title}`,
        description: "Navigate fabrizioduroni.it like a Unix shell: cd, ls, cat and open your way through the site.",
        slug: slugs.terminal,
        imageUrl: siteMetadata.featuredImage,
        ogPageType: "website",
    }),
};

/**
 * This route is a shareable "boot link", not a real page: the globally
 * mounted terminal overlay (src/components/features/terminal/terminal)
 * detects a fresh load of /terminal on mount and opens itself over the
 * homepage, keeping the URL at /terminal (sticky, shareable entry point) while
 * this stub stays fully covered by the overlay's inert/aria-hidden background.
 * This fallback only renders for the brief moment before that effect runs (or
 * with JS disabled). Closing the overlay from this boot state replaces the
 * URL with "/" so the real homepage is revealed instead of this stub.
 */
export default function TerminalPage() {
    return <p>Booting the terminal...</p>;
}
