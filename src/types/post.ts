import { ReadTimeResults } from "reading-time";
import { Author } from "@/types/author";

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

export type PostFrontMatter = {
  slug: PostSlug;
  title: string;
  description: string;
  date: PostDate;
  tags: string[];
  authors: Author[];
  image: string;
};

export type Post = {
  frontmatter: PostFrontMatter;
  readingTime: ReadTimeResults;
  fileName: string;
  content: string;
};

export type PostParser = (fileName: string, extension: string) => Post
