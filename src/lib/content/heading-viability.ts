import type { ContentHeading } from "@/types/content/heading";

/**
 * The on-page HTML table of contents is only worth showing once there is real structure to navigate —
 * fewer than 3 entries is closer to nothing than to a table of contents. DSA exercise pages, which all
 * share an identical fixed 3-section template, are excluded at the consumer (`exercise.tsx` simply
 * never passes `headings` to the reading companion) rather than here, so this predicate stays purely
 * count-based and free of any DSA-specific knowledge.
 */
export const isTableOfContentsViable = (headings: ContentHeading[]): boolean => headings.length >= 3;

/**
 * The `/markdown` outline is worth rendering the moment there is more than one section to link to —
 * even a fixed 3-section exercise template becomes 3 precisely citable deep links for an agent, which
 * is exactly the "cite a source precisely" behavior this delivery exists for. Deliberately a lower bar
 * than the HTML gate: exercises are included here even though they are excluded from the on-page TOC.
 */
export const isMarkdownOutlineViable = (headings: ContentHeading[]): boolean => headings.length >= 2;
