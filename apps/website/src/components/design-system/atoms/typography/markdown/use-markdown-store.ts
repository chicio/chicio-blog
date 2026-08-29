import { useMemo } from "react";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { StateStore } from "matrix-component-store";
import { markdownRemarkPlugins } from "./markdown-plugins";

const parser = unified().use(remarkParse).use(markdownRemarkPlugins);

type MarkdownState = {
    blocks: string[];
};

/**
 * Splits content into top-level blocks so each memoises independently while a response streams.
 * If any node lacks source offsets the whole content is returned as one block: that loses the
 * memoisation granularity, but never drops content.
 */
const topLevelBlocks = (content: string): string[] => {
    const blocks: string[] = [];

    for (const { position } of parser.parse(content).children) {
        if (position?.start.offset === undefined || position.end.offset === undefined) {
            return [content];
        }

        blocks.push(content.slice(position.start.offset, position.end.offset));
    }

    return blocks;
};

export const useMarkdownStore = (content: string): StateStore<MarkdownState> => {
    const blocks = useMemo(() => topLevelBlocks(content), [content]);

    return {
        state: { blocks },
    };
};
