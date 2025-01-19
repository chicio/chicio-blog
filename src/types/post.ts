import { ReadTimeResults } from "reading-time";
import { Author } from "@/types/author";

export type Tag = {
  tagValue: string;
  count: number;
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
  comments: boolean;
  commentsIdentifier: string;
  authors: Author[];
  image: string;
};

export type Post = {
  frontmatter: PostFrontMatter;
  readingTime: ReadTimeResults;
  content: string;
};

export type SearchablePostFields = {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  authors: string[];
};

export type PostParser = (
    filePath: string,
    fileName: string,
) => Post
