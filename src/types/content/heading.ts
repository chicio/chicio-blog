import { ReadTimeResults } from "reading-time";

/**
 * The reading companion only surfaces h2/h3 — h1 is the page title, already rendered separately (see
 * `stripLeadingTitleHeading`), and h4+ is out of scope for delivery 1 (see the heading-level codemod,
 * delivery 2).
 */
export type HeadingLevel = 2 | 3;

/**
 * One h2/h3 heading extracted from a piece of MDX content. `id` is generated with `github-slugger` so
 * it matches the `id` attribute `rehype-slug` puts on the same heading when the page renders — the two
 * must never diverge, or every anchor derived from it breaks silently. `readingTime` covers only the
 * words between this heading and the next one in the document.
 */
export interface ContentHeading {
    level: HeadingLevel;
    id: string;
    text: string;
    readingTime: ReadTimeResults;
}
