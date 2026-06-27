import { useMemo } from "react";
import { marked } from "marked";
import type { StateStore } from "@/types/component-store";

type MarkdownState = {
    blocks: string[];
};

export const useMarkdownStore = (content: string): StateStore<MarkdownState> => {
    const blocks = useMemo(() => {
        const tokens = marked.lexer(content);
        return tokens.map((token) => token.raw);
    }, [content]);

    return {
        state: { blocks },
    };
};
