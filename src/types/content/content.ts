import { ReadTimeResults } from "reading-time";
import { Frontmatter } from "./frontmatter";
import { Slug } from "./slug";
import { ContentHeading } from "./heading";

export type Content<TMeta = unknown> = {
    frontmatter: Frontmatter<TMeta>;
    slug: Slug;
    readingTime: ReadTimeResults;
    contentFileRelativePath: string;
    content: string;
    headings: ContentHeading[];
};