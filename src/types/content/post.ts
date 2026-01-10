import { ReadTimeResults } from "reading-time";
import { Frontmatter } from "./frontmatter";

export type PostSlug = {
  year: string;
  month: string;
  day: string;
  text: string;
  formatted: string;
};

export type Post = {
  frontmatter: Frontmatter;
  slug: PostSlug;
  readingTime: ReadTimeResults;
  fileName: string;
  content: string;
};