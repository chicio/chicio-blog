import { TerminalLine } from "chicio-blog";

// TerminalLine is a block-level div. A single line is wrapped in a flex row so it shrinks to its
// content instead of stretching across the whole card and reading as an empty bar.
export const Default = () => (
    <div className="flex">
        <TerminalLine>$ npm run build</TerminalLine>
    </div>
);

export const BuildOutput = () => (
    <div className="glow-container bg-general-background-light p-4">
        <TerminalLine>$ npm run build</TerminalLine>
        <TerminalLine>▲ Next.js 16.0.1</TerminalLine>
        <TerminalLine>✓ Compiled successfully in 12.4s</TerminalLine>
        <TerminalLine>✓ Generating static pages (514/514)</TerminalLine>
        <TerminalLine>✓ Search index written to public/search-index.json</TerminalLine>
    </div>
);

export const WrappedCommand = () => (
    <div className="max-w-[500px]">
        <TerminalLine>
            $ curl -H &apos;Accept: text/markdown&apos; https://www.fabrizioduroni.it/blog/2026/05/01/build-mcp-server-typescript
        </TerminalLine>
    </div>
);
