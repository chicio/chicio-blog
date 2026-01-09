import fs from "fs";
import path from "path";
import { Content } from "@/types/content/content";
import { grayMatterContent } from "./gray-matter";

const contentDirectory = path.join(process.cwd(), "src/content");
const contentMdxFileName = "content.mdx";

const findContentFiles = (dir: string, baseDir: string = dir): string[] => {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const contentDirs: string[] = [];

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            contentDirs.push(...findContentFiles(fullPath, baseDir));
        } else if (entry.isFile() && entry.name === contentMdxFileName) {
            const dirPath = path.relative(baseDir, dir);
            contentDirs.push(dirPath);
        }
    }

    return contentDirs;
};

export const getContent = (): Content[] => {
    const allContent: Content[] = [];

    const contentDirs = fs.readdirSync(contentDirectory, { withFileTypes: true })
        .filter(entry => entry.isDirectory() && entry.name !== 'posts')
        .map(entry => entry.name);

    for (const dir of contentDirs) {
        const dirPath = path.join(contentDirectory, dir);
        const contentPaths = findContentFiles(dirPath, contentDirectory);

        for (const relativeDirPath of contentPaths) {
            const contentFilePath = path.join(contentDirectory, relativeDirPath, contentMdxFileName);

            allContent.push({
                frontmatter: grayMatterContent(contentFilePath).frontmatter,
                slug: `/${relativeDirPath}`,
            });
        }
    }

    return allContent;
};
