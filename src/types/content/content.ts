import { ReadTimeResults } from "reading-time";
import { Frontmatter } from "./frontmatter";
import { Slug } from "./slug";

export type Content = {
  frontmatter: Frontmatter;
  slug: Slug;
  readingTime: ReadTimeResults;
  contentPath: string;
  content: string;
};