import { Post } from "@/types/post";
import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import githubFlavoredMarkdown from "remark-gfm";
import html from "remark-html";
import math from "remark-math";
import rehype from "remark-rehype";
import katex from "rehype-katex";
import syntaxHighlight from "rehype-highlight";
import stringify from "rehype-stringify";
import calculateReadingTime from "reading-time";
import { getFrontmatterFrom } from "@/lib/posts/frontmatter";
import { getPostsUsing } from "@/lib/posts/posts-with-parser";

const getSearchPostFromFilePath: (
  filePath: string,
  fileName: string,
) => Post = (filePath: string, fileName: string) => {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const fileParsed = matter(fileContents);

  const remarkProcessor = remark()
    .use(githubFlavoredMarkdown)
    .use(html)
    .use(math)
    .use(rehype)
    .use(katex, { strict: false })
    .use(syntaxHighlight)
    .use(stringify);

  const htmlContent = remarkProcessor
    .processSync(fileParsed.content)
    .toString();

  return {
    frontmatter: getFrontmatterFrom(fileParsed, fileName),
    readingTime: calculateReadingTime(htmlContent),
    content: htmlContent,
  };
};

export const getSearchablePost = getPostsUsing(getSearchPostFromFilePath);
