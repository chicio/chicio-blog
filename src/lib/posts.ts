import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {remark} from "remark";
import githubFlavoredMarkdown from "remark-gfm";
import emoji from 'remark-emoji'
import html from "remark-html";
import calculateReadingTime from "reading-time";
import {NextPostParameters, Post, PostFrontMatter, PostParameters} from "@/types/post";
import {authors} from "@/types/author";

const postsDirectory = path.join(process.cwd(), "posts");
const mdExtension = ".md"

const generatePostSlugFrom = (filename: string) => {
    const [year, month, day, ...slug] = filename.split("-");
    return `/blog/${year}/${month}/${day}/${slug.join("-")}`.replace(mdExtension, "");
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
        date: data.date,
        tags: data.tags,
        comments: data.comments,
        authors: data.authors.map((author: string) => authors[author]),
    };
};

export const getAllPosts = (): PostFrontMatter[] => {
    const filesNames = fs.readdirSync(postsDirectory);

    return filesNames
        .map((fileName) => {
            const filePath = path.join(postsDirectory, fileName);
            const fileContents = fs.readFileSync(filePath, "utf8");
            const fileParsed = matter(fileContents);
            return getFrontmatterFrom(fileParsed, fileName);
        }).sort((a, b) =>
            new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const getPostBy = (
    year: string,
    month: string,
    day: string,
    slug: string
): Post => {
    const filePath = path.join(postsDirectory, generateFileNameFrom(year, month, day, slug));
    const fileContents = fs.readFileSync(filePath, "utf8");
    const fileParsed = matter(fileContents);

    const htmlContent = remark()
        .use(githubFlavoredMarkdown)
        .use(emoji)
        .use(html)
        .processSync(fileParsed.content)
        .toString();

    return {
        frontmatter: getFrontmatterFrom(fileParsed, slug),
        readingTime: calculateReadingTime(htmlContent),
        content: htmlContent,
    };
};

export const generateAllPostParams = (): PostParameters[] => {
    const filenames = fs.readdirSync(postsDirectory);

    return filenames.map((filename) => {
        const [year, month, day, ...slug] = filename.split("-");
        return {
            year, month, day, slug: slug.join('-').replace(/\.md$/, ''),
        };
    });
}

