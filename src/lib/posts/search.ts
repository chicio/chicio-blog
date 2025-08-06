import elasticlunr from "elasticlunr";
import { Post, SearchablePostFields } from "@/types/post";
import path from "path";
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
import {searchIndexFileName} from "@/lib/posts/files";

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
    .use(katex, { strict: false }) // Render LaTeX with KaTeX
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

const getSearchablePost = getPostsUsing(getSearchPostFromFilePath);

const createSearchIndex = () => {
  const posts = getSearchablePost();

  const index = elasticlunr<SearchablePostFields>(function () {
    this.addField("title");
    this.addField("description");
    this.addField("tags");
    this.addField("authors");
    this.setRef("slug");
  });

  posts.forEach((post) =>
    index.addDoc({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      authors: post.frontmatter.authors.map((author) => author.name),
      slug: post.frontmatter.slug.formatted,
    }),
  );

  return index;
};

const generateAndSaveSearchIndex = () => {
  try {
    const index = createSearchIndex();
    const serializedIndex = JSON.stringify(index);
    const outputPath = path.join(process.cwd(), "public", searchIndexFileName);
    fs.writeFileSync(outputPath, serializedIndex, "utf8");
  } catch (error) {
    console.error("Error generating search index:", error);
    process.exit(1);
  }
};

generateAndSaveSearchIndex();
