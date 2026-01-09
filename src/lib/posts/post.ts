import fs from "fs";
import matter from "gray-matter";
// import { remark } from "remark";
// import githubFlavoredMarkdown from "remark-gfm";
// import emoji from "remark-emoji";
// import youtube from "remark-youtube";
// import html from "remark-html";
// import math from "remark-math";
// import rehype from "remark-rehype";
// import slug from "rehype-slug";
// import autolink from "rehype-autolink-headings";
// import katex from "rehype-katex";
// import syntaxHighlight from "rehype-highlight";
// import figure from "@microflash/rehype-figure";
// import stringify from "rehype-stringify";
import calculateReadingTime from "reading-time";
import { getFrontmatterFrom } from "@/lib/posts/frontmatter";
import { PostParser } from "@/types/post";
import { postsDirectory } from "./post-dir";
import path from "path";

export const getPost: PostParser = (fileName, extension) => {
  const filePath = path.join(postsDirectory, `${fileName}${extension}`);
  const fileContents = fs.readFileSync(filePath, "utf8");
  const fileParsed = matter(fileContents);
  // const remarkProcessor = remark()
  //   .use(githubFlavoredMarkdown)
  //   .use(emoji)
  //   .use(youtube)
  //   .use(html)
  //   .use(math)
  //   .use(rehype)
  //   .use(slug)
  //   .use(autolink, {
  //     behavior: "wrap",
  //     properties: { className: ["heading-anchor"] },
  //   })
  //   .use(katex, { strict: false }) // Render LaTeX with KaTeX
  //   .use(syntaxHighlight)
  //   .use(figure)
  //   .use(stringify);

  return {
    frontmatter: getFrontmatterFrom(fileParsed, fileName),
    readingTime: calculateReadingTime(fileParsed.content),
    fileName
  };
};
