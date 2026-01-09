import { PostDate, PostFrontMatter } from "@/types/content/post";
import { authors } from "@/types/author";
import matter from "gray-matter";
import fs from "fs";
import { ContentFrontmatter } from "@/types/content/content";

const parseWithGrayMatter = (filePath: string): matter.GrayMatterFile<string> => {
  const fileContents = fs.readFileSync(filePath, "utf8");
  return matter(fileContents);
}

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const generatePostDate = (date: Date): PostDate => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    formatted: formatDate(date),
  };
};

export const grayMatterPost = (
  filePath: string,
): { frontmatter: PostFrontMatter; content: string } => {
  const fileParsed = parseWithGrayMatter(filePath);

  return {
    frontmatter: {
      title: fileParsed.data.title,
      description: fileParsed.data.description,
      date: generatePostDate(fileParsed.data.date),
      tags: fileParsed.data.tags,
      authors: fileParsed.data.authors.map((author: string) => authors[author]),
      image: fileParsed.data.image,
    },
    content: fileParsed.content,
  };
};

export const grayMatterContent = (
  filePath: string,
): { frontmatter: ContentFrontmatter; content: string } => {
  const fileParsed = parseWithGrayMatter(filePath);

  return {
    frontmatter: {
      title: fileParsed.data.title,
      description: fileParsed.data.description,
      tags: fileParsed.data.tags,
      authors: fileParsed.data.authors.map((author: string) => authors[author]),
    },
    content: fileParsed.content,
  };
}
