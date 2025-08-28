import { marked } from 'marked';
import { memo, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import remarkEmoji from 'remark-emoji';
import rehypeHighlight from 'rehype-highlight';
import rehypeKatex from 'rehype-katex';
import styled from 'styled-components';
import { standardLinkStyle } from "@/components/design-system/atoms/links/standard-link-style";

const StyledMarkdownContainer = styled.div`
  a {
    ${standardLinkStyle};
    line-height: ${(props) => props.theme.lineHeight};
    color: ${(props) => props.theme.colors.primaryColor} !important;
    text-decoration: none;
    word-break: break-all; /* Force long URLs to break */
    word-wrap: break-word; /* Fallback for older browsers */
    overflow-wrap: break-word; /* Modern standard */
    hyphens: auto; /* Add hyphens where appropriate */
  }
`;

const MarkdownBlock = memo(
  ({ content }: { content: string }) => (
    <StyledMarkdownContainer>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath, remarkEmoji]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
      >
        {content}
      </ReactMarkdown>
    </StyledMarkdownContainer>
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
