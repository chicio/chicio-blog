import { useMemo } from "react";
import { marked } from "marked";

type MarkdownState = {
    blocks: string[];
};

export const useMarkdownStore = (content: string): { state: MarkdownState; effects: Record<string, never> } => {
    const blocks = useMemo(() => {
        const tokens = marked.lexer(content);
        return tokens.map((token) => token.raw);
    }, [content]);

    return {
        state: { blocks },
        effects: {},
    };
};
