import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import {Post, PostFrontMatter} from "@/types/post";
import remarkHtml from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");
const mdExtension = ".md"

const generatePostSlugFrom = (filename: string) => {
    console.log(filename)
    const [year, month, day, ...title] = filename.split("-");
    return `/blog/${year}/${month}/${day}/${title.join("-")}`.replace(mdExtension, "");
};

const generateFileNameFrom = (year: string, month: string, day: string,slug: string) => {
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
        authors: data.authors,
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
        .use(remarkGfm)
        .use(remarkHtml)
        .processSync(fileParsed.content)
        .toString();

    return {
        frontmatter: getFrontmatterFrom(fileParsed, slug),
        content: htmlContent,
    };
};
