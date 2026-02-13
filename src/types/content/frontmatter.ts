import { Author } from "@/types/content/author";

export interface PublishDate {
  year: number;
  month: number;
  day: number;
  formatted: string;
}

export type Frontmatter<TMeta = unknown> = {
  title: string;
  description: string;
  tags: string[];
  authors: Author[];
  date: PublishDate;
  image: string;
  metadata?: TMeta;
};
