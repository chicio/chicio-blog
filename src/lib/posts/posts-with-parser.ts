import {Post, PostParser} from "@/types/post";
import fs from "fs";
import {postsDirectory} from "@/lib/posts/post-dir";
import path from "path";

export const getPostsUsing = (parser: PostParser) => (): Post[] =>
    fs
        .readdirSync(postsDirectory)
        .map((fileName) => { 
            const { name, ext } = path.parse(fileName);
            return parser(name, ext);
        })
        .sort((a, b) => new Date(b.frontmatter.date.formatted).getTime() - new Date(a.frontmatter.date.formatted).getTime());
