import { TerminalQuoteLine } from "chicio-blog";

// TerminalQuoteLine centres its own text, so it is deliberately NOT wrapped in a shrink-to-fit flex
// row: it needs the full width of its container for the centring to be visible.
export const Default = () => <TerminalQuoteLine>There is no spoon.</TerminalQuoteLine>;

export const TerminalIntro = () => (
    <div className="glow-container bg-general-background-light px-4 py-6">
        <TerminalQuoteLine>Wake up, Neo...</TerminalQuoteLine>
        <TerminalQuoteLine>The Matrix has you...</TerminalQuoteLine>
        <TerminalQuoteLine>Follow the white rabbit.</TerminalQuoteLine>
    </div>
);

export const LongQuote = () => (
    <div className="mx-auto max-w-md">
        <TerminalQuoteLine>
            I know you are out there. I can feel you now. I know that you are afraid of us.
        </TerminalQuoteLine>
    </div>
);
