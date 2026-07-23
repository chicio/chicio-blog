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
 * detects a fresh load of /terminal on mount, replaces the URL with "/" and
 * opens itself over the homepage. This fallback only renders for the brief
 * moment before that effect runs (or with JS disabled).
 */
export default function TerminalPage() {
    return <p>Booting the terminal...</p>;
}
