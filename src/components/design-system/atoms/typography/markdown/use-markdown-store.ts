import { useMemo } from "react";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { StateStore } from "@/types/component-store";

const parser = unified().use(remarkParse).use(remarkGfm);

type MarkdownState = {
    blocks: string[];
};

const topLevelBlocks = (content: string): string[] =>
    parser
        .parse(content)
        .children.map(({ position }) =>
            position?.start.offset === undefined || position.end.offset === undefined
                ? ""
                : content.slice(position.start.offset, position.end.offset),
        )
        .filter((block) => block.length > 0);

export const useMarkdownStore = (content: string): StateStore<MarkdownState> => {
    const blocks = useMemo(() => topLevelBlocks(content), [content]);

    return {
        state: { blocks },
    };
};
