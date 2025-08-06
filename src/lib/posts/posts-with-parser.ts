import {Post, PostParser} from "@/types/post";
import fs from "fs";
import path from "path";
import {postsDirectory} from "@/lib/posts/post-dir";

export const getPostsUsing = (parser: PostParser) => (): Post[] =>
    fs
        .readdirSync(postsDirectory)
        .map((fileName) =>
            parser(path.join(postsDirectory, fileName), fileName),
        )
        .sort(
            (a, b) =>
                new Date(b.frontmatter.date.formatted).getTime() -
                new Date(a.frontmatter.date.formatted).getTime(),
        );
