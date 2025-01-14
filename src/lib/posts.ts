import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {remark} from "remark";
import githubFlavoredMarkdown from "remark-gfm";
import emoji from 'remark-emoji'
import html from "remark-html";
import math from "remark-math";
import rehype from 'remark-rehype'
import katex from "rehype-katex";
import stringify from 'rehype-stringify'
import syntaxHighlight from 'rehype-highlight'
import youtube from 'remark-youtube';
import calculateReadingTime from "reading-time";
import {Post, PostFrontMatter} from "@/types/post";
import {authors} from "@/types/author";
import {slugs} from "@/types/slug";

const postsDirectory = path.join(process.cwd(), "posts");
const mdExtension = ".md"
const postsPerPage = 11;

const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(date);
};

const generatePostSlugFrom = (filename: string) => {
    const [year, month, day, ...slug] = filename.split("-");
    return `${slugs.blogPost}${year}/${month}/${day}/${slug.join("-")}`.replace(mdExtension, "");
};

const generateFileNameFrom = (year: string, month: string, day: string, slug: string) => {
    return `${year}-${month}-${day}-${slug}${mdExtension}`;
};

const getFrontmatterFrom = (
    fileParsed: matter.GrayMatterFile<string>,
    fileName: string
): PostFrontMatter => {
    const {data}: matter.GrayMatterFile<string> = fileParsed;

    return {
        slug: generatePostSlugFrom(fileName),
        title: data.title,
        description: data.description,
        date: formatDate(data.date),
        tags: data.tags,
        comments: data.comments,
        authors: data.authors.map((author: string) => authors[author]),
        image: data.image,
    };
};

const getPostFromFilePath = (filePath: string, fileName: string) => {
    const fileContents = fs.readFileSync(filePath, "utf8");
    const fileParsed = matter(fileContents);

    const htmlContent = remark()
        .use(githubFlavoredMarkdown)
        .use(emoji)
        .use(youtube)
        .use(html)
        .use(math)
        .use(rehype)
        .use(katex) // Render LaTeX with KaTeX
        .use(syntaxHighlight)
        .use(stringify)
        .processSync(fileParsed.content)
        .toString();

    return {
        frontmatter: getFrontmatterFrom(fileParsed, fileName),
        readingTime: calculateReadingTime(htmlContent),
        content: htmlContent,
    };
}

export const getAllPosts = (): Post[] => {
    const filesNames = fs.readdirSync(postsDirectory);

    return filesNames
        .map((fileName) => {
            const filePath = path.join(postsDirectory, fileName);
           return getPostFromFilePath(filePath, fileName)
        }).sort((a, b) =>
            new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());
};

export const getPostBy = (
    year: string,
    month: string,
    day: string,
    slug: string
): Post => {
    const filePath = path.join(postsDirectory, generateFileNameFrom(year, month, day, slug));
    return getPostFromFilePath(filePath, slug)
};

const groupArrayBy: <T>(array: T[], numberPerGroup: number) => T[][] = (data, n) => {
    const group = Array(0);
    for (let i = 0, j = 0; i < data.length; i += 1) {
        if (i >= n && i % n === 0) j += 1;
        group[j] = group[j] || [];
        group[j].push(data[i]);
    }
    return group;
};

export const getPostsPaginationFor = (page: number) => {
    const posts = getAllPosts();
    const start = (page - 1) * postsPerPage;
    const paginatedPosts = posts.slice(start, start + postsPerPage);
    const totalPages = Math.ceil(posts.length / postsPerPage);
    const previousPageUrl = page > 1 ? `${slugs.blogPage}/${page - 1}` : undefined
    const nextPageUrl = page < totalPages ? `${slugs.blogPage}/${page + 1}` : undefined

    const postsGrouped = groupArrayBy(paginatedPosts.slice(1, paginatedPosts.length), 2);


    return { launchPost: paginatedPosts[0], postsGrouped, previousPageUrl, nextPageUrl };
}
