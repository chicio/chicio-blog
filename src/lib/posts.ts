import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface PostMetadata {
    title: string;
    date: string;
    slug: string;
    excerpt?: string;
}

const postsDirectory = path.join(process.cwd(), "posts");

export function getAllPosts(): PostMetadata[] {
    const files = fs.readdirSync(postsDirectory);

    return files.map((file) => {
        const filePath = path.join(postsDirectory, file);
        const fileContents = fs.readFileSync(filePath, "utf8");
        const { data } = matter(fileContents);

        return {
            title: data.title,
            date: data.date,
            slug: file.replace(/\.md$/, ""),
            excerpt: data.excerpt,
        };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string) {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        metadata: {
            title: data.title,
            date: data.date,
        },
        content,
    };
}
