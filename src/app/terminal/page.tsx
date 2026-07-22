import { Terminal } from "@/components/content/terminal";
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

export default function TerminalPage() {
    return <Terminal />;
}
