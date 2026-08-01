import { ReadTimeResults } from "reading-time";
import { Frontmatter } from "./frontmatter";
import { Slug } from "./slug";

/**
 * Deliberately has no `headings` field. Every content-walking test in `src/lib/content/**`,
 * `src/lib/build/**` and `src/lib/mdx/**` constructs or walks many `Content` items per `it()`, and
 * `extractHeadings` (see `headings.ts`) does a full remark AST parse — cheap once, expensive across the
 * whole ~550-file tree. Populating `headings` eagerly on every ingested item (as `getAllContentFor`/
 * `getSingleContentBy` used to) paid that cost for every item on every ingestion, timing out tests that
 * merely walk content without ever looking at headings (e.g. `indexable-content.test.ts`). Headings are
 * derived on demand, only at the handful of call sites that actually render or cite them, via
 * `extractHeadings(content.content)` — itself memoized by markdown string, so repeated calls for the same
 * content are still free.
 */
export type Content<TMeta = unknown> = {
    frontmatter: Frontmatter<TMeta>;
    slug: Slug;
    readingTime: ReadTimeResults;
    contentFileRelativePath: string;
    content: string;
};