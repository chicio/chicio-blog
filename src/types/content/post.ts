import { ReadTimeResults } from "reading-time";
import { ContentFrontmatter } from "@/types/content/content";
import { Frontmatter } from "./frontmatter";

export type Tag = {
  tagValue: string;
  count: number;
  tagSlugText: string;
  slug: string;
};

export type PostDate = {
  year: number;
  month: number;
  day: number;
  formatted: string;
};

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