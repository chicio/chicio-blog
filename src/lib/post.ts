import fs from "fs";
import matter from "gray-matter";
import { remark } from "remark";
import githubFlavoredMarkdown from "remark-gfm";
import emoji from "remark-emoji";
import youtube from "remark-youtube";
import html from "remark-html";
import math from "remark-math";
import rehype from "remark-rehype";
import katex from "rehype-katex";
import syntaxHighlight from "rehype-highlight";
import figure from "@microflash/rehype-figure";
import stringify from "rehype-stringify";
import calculateReadingTime from "reading-time";
import { getFrontmatterFrom } from "@/lib/frontmatter";
import { Post } from "@/types/post";

export const getPostFromFilePath: (
  filePath: string,
  fileName: string,
) => Post = (filePath: string, fileName: string) => {
  const fileContents = fs.readFileSync(filePath, "utf8");
  const fileParsed = matter(fileContents);
  const remarkProcessor = remark()
    .use(githubFlavoredMarkdown)
    .use(emoji)
    .use(youtube)
    .use(html)
    .use(math)
    .use(rehype)
    .use(katex, { strict: false }) // Render LaTeX with KaTeX
    .use(syntaxHighlight)
    .use(figure)
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
