import path from "path";
import fs from "fs";
import { cached } from "@/lib/build/build-cache";
import { ArchivedComment, ArchivedCommentsArchive } from "@/types/content/comment";

const archivedCommentsFilePath = path.join(process.cwd(), "src/content/blog/archived-comments.json");

const readArchivedComments = (): ArchivedCommentsArchive =>
    cached("archived-comments", (): ArchivedCommentsArchive => {
        const fileContents = fs.readFileSync(archivedCommentsFilePath, "utf8");
        return JSON.parse(fileContents) as ArchivedCommentsArchive;
    });

export const getArchivedCommentsBy = (slug: string): ArchivedComment[] => readArchivedComments()[slug] ?? [];
