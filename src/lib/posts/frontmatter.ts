import {slugs} from "@/types/slug";
import {PostDate, PostFrontMatter, PostSlug} from "@/types/post";
import {authors} from "@/types/author";
import matter from "gray-matter";
import {mdExtension} from "@/lib/posts/files";

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
};

const generatePostSlugFrom = (filename: string): PostSlug => {
  const [year, month, day, ...slug] = filename.split("-");
  const text = slug.join("-").replace(mdExtension, "");

  return {
    year,
    month,
    day,
    text: text,
    formatted: `${slugs.blog.blogPost}/${year}/${month}/${day}/${text}`,
  };
};

const generatePostDate = (date: Date): PostDate => {
  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    formatted: formatDate(date),
  };
};

export const getFrontmatterFrom = (
  fileParsed: matter.GrayMatterFile<string>,
  fileName: string,
): PostFrontMatter => {
  const { data }: matter.GrayMatterFile<string> = fileParsed;

  return {
    slug: generatePostSlugFrom(fileName),
    title: data.title,
    description: data.description,
    date: generatePostDate(data.date),
    tags: data.tags,
    authors: data.authors.map((author: string) => authors[author]),
    image: data.image,
  };
};
