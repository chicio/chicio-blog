import { contentRegistry } from "@/lib/content/registry";
import { isTableOfContentsViable } from "@/lib/content/heading-viability";
import { slugs } from "@/types/configuration/slug";

/**
 * The only two registry entries whose consumer actually wires the on-page table of contents (see plan
 * §7b) — blog posts and DSA topics. DSA exercises share the same `isTableOfContentsViable` count-based
 * gate and would technically pass it (every exercise has exactly 3 h2), but `exercise.tsx` never renders
 * the organism regardless, so counting them here would queue editorial work that could never surface.
 */
const tableOfContentsConsumerSlugs = new Set<string>([slugs.blog.blogPost, slugs.dataStructuresAndAlgorithms.topic]);

/**
 * Every blog post / DSA topic that fails the on-page table-of-contents gate (fewer than 3 h2/h3
 * headings) — the editorial work queue for delivery 3 (authoring sections into the archive). This is
 * report only: it never fails the build, it just prints the current gap list on every build so the
 * queue stays visible.
 */
export const reportTableOfContentsGaps = (): void => {
    try {
        console.log("📖 Checking reading-companion table-of-contents coverage...");

        const gaps = contentRegistry
            .filter((entry) => entry.content && tableOfContentsConsumerSlugs.has(entry.slug))
            .flatMap((entry) => entry.content!())
            .filter((content) => !isTableOfContentsViable(content.headings))
            .map((content) => content.slug.formatted);

        if (gaps.length === 0) {
            console.log("✅ Every content-backed page clears the table-of-contents gate.");
            return;
        }

        console.log(`⚠️  ${gaps.length} page(s) below the table-of-contents gate (fewer than 3 h2/h3 headings):`);
        gaps.forEach((slug) => console.log(`   - ${slug}`));
    } catch (error) {
        console.error("Error checking table-of-contents coverage:", error);
    }
};
