import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

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

MarkdownBlock.displayName = 'MarkdownBlock';

export const Markdown = memo(
  ({ content, id }: { content: string; id: string }) => {
    const blocks = useMemo(() => {
      const tokens = marked.lexer(content);
      return tokens.map((token) => token.raw);
    }, [content]);

    return blocks.map((block, index) => (
      <MarkdownBlock content={block} key={`${id}-block_${index}`} />
    ));
  },
);

Markdown.displayName = 'Markdown';
