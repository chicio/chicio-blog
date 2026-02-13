import { authors } from "@/types/content/author";
import matter from "gray-matter";
import fs from "fs";
import { Frontmatter } from "@/types/content/frontmatter";

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const generatePublishDate = (date: Date) => ({
  year: date.getFullYear(),
  month: date.getMonth() + 1,
  day: date.getDate(),
  formatted: formatDate(date),
});

const parseWithGrayMatter = (
  filePath: string,
): matter.GrayMatterFile<string> => {
  const fileContents = fs.readFileSync(filePath, "utf8");
  return matter(fileContents);
};

export const grayMatterContent = <TMeta = unknown>(
  filePath: string,
  metadataAdapter?: (raw: unknown) => TMeta,
): { frontmatter: Frontmatter<TMeta>; content: string } => {
  const fileParsed = parseWithGrayMatter(filePath);
  const metadata = metadataAdapter
    ? metadataAdapter(fileParsed.data?.metadata)
    : undefined;

  return {
    frontmatter: {
      title: fileParsed.data.title,
      description: fileParsed.data.description,
      date: generatePublishDate(fileParsed.data.date),
      tags: fileParsed.data.tags,
      authors: fileParsed.data.authors.map((author: string) => authors[author]),
      image: fileParsed.data.image,
      metadata,
    },
    content: fileParsed.content,
  };
};
