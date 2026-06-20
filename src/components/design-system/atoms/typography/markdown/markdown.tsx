import { memo } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { useMarkdownStore } from "./use-markdown-store";

const MarkdownBlock = memo(
    ({ content }: { content: string }) => (
        <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
            rehypePlugins={[rehypeHighlight, rehypeKatex]}
        >
            {content}
        </ReactMarkdown>
    ),
    (prevProps, nextProps) => prevProps.content === nextProps.content,
);

MarkdownBlock.displayName = "MarkdownBlock";

const MarkdownRenderer = ({ content, id }: { content: string; id: string }) => {
    const { state } = useMarkdownStore(content);
    const { blocks } = state;

    return blocks.map((block, index) => <MarkdownBlock content={block} key={`${id}-block_${index}`} />);
};

export const Markdown = memo(MarkdownRenderer);

Markdown.displayName = "Markdown";
