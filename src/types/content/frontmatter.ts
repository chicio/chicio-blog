import { Author } from "@/types/content/author";

interface PublishDate {
  year: number;
  month: number;
  day: number;
  formatted: string;
};

export type Frontmatter = {
  title: string;
  description: string;
  tags: string[];
  authors: Author[];
  date: PublishDate;
  image: string;
};
