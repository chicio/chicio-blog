import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cursor, ErrorText, QuoteText, SuccessText, TerminalLine, TerminalQuoteLine } from ".";

// Typed as plain Meta/StoryObj rather than Meta<typeof Component>. These stories render
// explicitly instead of being driven by args — several compose more than one component —
// so binding the story type to a single component's props would demand an `args` object
// that nothing reads.
const meta: Meta = {
    title: "Atoms/Typography/Terminal Blocks",
    component: Cursor,
};

export default meta;

type Story = StoryObj;

// Cursor is a single underscore driven by the `blink` keyframes (opacity 1 for the first half of a
// 1s cycle, 0 for the second). The capture consistently lands in the invisible half, so every cell
// freezes the animation at frame 0 — the glyph is unchanged, only the blink is held still for the
// static shot.
const FreezeBlink = () => <style>{".ds-blink-still .animate-blink{animation-play-state:paused}"}</style>;

const CursorDefaultStory = () => (
    <div className="ds-blink-still text-accent flex gap-2 font-mono text-sm">
        <FreezeBlink />
        <span>$ npm run build</span>
        <Cursor />
    </div>
);

const CursorTerminalPromptStory = () => (
    <div className="ds-blink-still text-accent flex flex-col gap-2 font-mono text-sm">
        <FreezeBlink />
        <div className="flex gap-2">
            <span>visitor@fabrizioduroni.it:~$</span>
            <span>ls /blog</span>
        </div>
        <div className="flex gap-2">
            <span>visitor@fabrizioduroni.it:~$</span>
            <Cursor />
        </div>
    </div>
);

const CursorLoadingLineStory = () => (
    <div className="ds-blink-still text-accent flex gap-2 font-mono text-sm">
        <FreezeBlink />
        <span>&gt; Uploading knowledge...</span>
        <Cursor />
    </div>
);

// A bare <ErrorText> is a couple of words of red monospace: on its own in a tall card it reads as
// near-blank. Every cell pairs it with the terminal/form context it actually ships in.
const ErrorTextDefaultStory = () => (
    <div className="flex">
        <ErrorText>Invalid email address</ErrorText>
    </div>
);

const ErrorTextTerminalCommandFailureStory = () => (
    <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex gap-2">
            <span className="text-accent">$</span>
            <span className="text-primary-text">sudo rm -rf /</span>
        </div>
        <div className="flex">
            <ErrorText>command not found: sudo. Type &quot;help&quot; for a list of commands.</ErrorText>
        </div>
    </div>
);

const ErrorTextOfflineDiagnosticsStory = () => (
    <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex">
            <ErrorText>PING 8.8.8.8 ... Request timeout</ErrorText>
        </div>
        <div className="flex">
            <ErrorText>PING fabrizioduroni.it ... Unreachable</ErrorText>
        </div>
        <div className="flex">
            <ErrorText>ERROR 404: Page not found</ErrorText>
        </div>
    </div>
);

const QuoteTextDefaultStory = () => (
    <div className="flex">
        <QuoteText>This is your last chance...</QuoteText>
    </div>
);

const QuoteTextOfflineQuoteStory = () => (
    <div className="flex">
        <QuoteText>You are disconnected from the Matrix.</QuoteText>
    </div>
);

const QuoteTextShortQuoteStory = () => (
    <div className="flex">
        <QuoteText>Déjà vu</QuoteText>
    </div>
);

const SuccessTextDefaultStory = () => (
    <div className="flex">
        <SuccessText>&gt; Transfer complete.</SuccessText>
    </div>
);

const SuccessTextReadingProgressLinesStory = () => (
    <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex">
            <SuccessText>&gt; Uploading knowledge...</SuccessText>
        </div>
        <div className="flex">
            <SuccessText>[████████████████░░░░░░░░]&nbsp;&nbsp;65%</SuccessText>
        </div>
    </div>
);

const SuccessTextTerminalSessionStory = () => (
    <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex gap-2">
            <span className="text-accent">$</span>
            <span className="text-primary-text">cd /blog</span>
        </div>
        <div className="flex">
            <SuccessText>Wake up, Neo... you are now in /blog</SuccessText>
        </div>
        <div className="flex">
            <SuccessText>96 posts indexed. Type &quot;ls&quot; to list them.</SuccessText>
        </div>
    </div>
);

// TerminalLine is a block-level div. A single line is wrapped in a flex row so it shrinks to its
// content instead of stretching across the whole card and reading as an empty bar.
const TerminalLineDefaultStory = () => (
    <div className="flex">
        <TerminalLine>$ npm run build</TerminalLine>
    </div>
);

const TerminalLineBuildOutputStory = () => (
    <div className="glow-container bg-general-background-light p-4">
        <TerminalLine>$ npm run build</TerminalLine>
        <TerminalLine>▲ Next.js 16.0.1</TerminalLine>
        <TerminalLine>✓ Compiled successfully in 12.4s</TerminalLine>
        <TerminalLine>✓ Generating static pages (514/514)</TerminalLine>
        <TerminalLine>✓ Search index written to public/search-index.json</TerminalLine>
    </div>
);

const TerminalLineWrappedCommandStory = () => (
    <div className="max-w-[500px]">
        <TerminalLine>
            $ curl -H &apos;Accept: text/markdown&apos;
            https://www.fabrizioduroni.it/blog/2026/05/01/build-mcp-server-typescript
        </TerminalLine>
    </div>
);

// TerminalQuoteLine centres its own text, so it is deliberately NOT wrapped in a shrink-to-fit flex
// row: it needs the full width of its container for the centring to be visible.
const TerminalQuoteLineDefaultStory = () => <TerminalQuoteLine>There is no spoon.</TerminalQuoteLine>;

const TerminalQuoteLineTerminalIntroStory = () => (
    <div className="glow-container bg-general-background-light px-4 py-6">
        <TerminalQuoteLine>Wake up, Neo...</TerminalQuoteLine>
        <TerminalQuoteLine>The Matrix has you...</TerminalQuoteLine>
        <TerminalQuoteLine>Follow the white rabbit.</TerminalQuoteLine>
    </div>
);

const TerminalQuoteLineLongQuoteStory = () => (
    <div className="mx-auto max-w-md">
        <TerminalQuoteLine>
            I know you are out there. I can feel you now. I know that you are afraid of us.
        </TerminalQuoteLine>
    </div>
);

export const CursorDefault: Story = { render: () => <CursorDefaultStory /> };
export const CursorTerminalPrompt: Story = { render: () => <CursorTerminalPromptStory /> };
export const CursorLoadingLine: Story = { render: () => <CursorLoadingLineStory /> };
export const ErrorTextDefault: Story = { render: () => <ErrorTextDefaultStory /> };
export const ErrorTextTerminalCommandFailure: Story = { render: () => <ErrorTextTerminalCommandFailureStory /> };
export const ErrorTextOfflineDiagnostics: Story = { render: () => <ErrorTextOfflineDiagnosticsStory /> };
export const QuoteTextDefault: Story = { render: () => <QuoteTextDefaultStory /> };
export const QuoteTextOfflineQuote: Story = { render: () => <QuoteTextOfflineQuoteStory /> };
export const QuoteTextShortQuote: Story = { render: () => <QuoteTextShortQuoteStory /> };
export const SuccessTextDefault: Story = { render: () => <SuccessTextDefaultStory /> };
export const SuccessTextReadingProgressLines: Story = { render: () => <SuccessTextReadingProgressLinesStory /> };
export const SuccessTextTerminalSession: Story = { render: () => <SuccessTextTerminalSessionStory /> };
export const TerminalLineDefault: Story = { render: () => <TerminalLineDefaultStory /> };
export const TerminalLineBuildOutput: Story = { render: () => <TerminalLineBuildOutputStory /> };
export const TerminalLineWrappedCommand: Story = { render: () => <TerminalLineWrappedCommandStory /> };
export const TerminalQuoteLineDefault: Story = { render: () => <TerminalQuoteLineDefaultStory /> };
export const TerminalQuoteLineTerminalIntro: Story = { render: () => <TerminalQuoteLineTerminalIntroStory /> };
export const TerminalQuoteLineLongQuote: Story = { render: () => <TerminalQuoteLineLongQuoteStory /> };
