import { ErrorText } from "chicio-blog";

// A bare <ErrorText> is a couple of words of red monospace: on its own in a tall card it reads as
// near-blank. Every cell pairs it with the terminal/form context it actually ships in.
export const Default = () => (
    <div className="flex">
        <ErrorText>Invalid email address</ErrorText>
    </div>
);

export const TerminalCommandFailure = () => (
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

export const OfflineDiagnostics = () => (
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
