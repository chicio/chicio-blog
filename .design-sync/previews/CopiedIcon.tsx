import { CopiedIcon } from "chicio-blog";

// CopiedIcon is a fixed size-4 checkmark — the confirmed state of the code-block copy button. On its
// own it is a 16px mark, so each cell gives it the label or button chrome it ships with.
export const Default = () => (
    <div className="flex items-center gap-2 text-accent">
        <CopiedIcon />
        <span className="font-mono text-sm">Copied!</span>
    </div>
);

export const CopyButton = () => (
    <div className="flex">
        <span className="flex items-center gap-2 rounded border border-accent bg-general-background-light px-3 py-2 text-accent">
            <CopiedIcon />
            <span className="font-mono text-xs uppercase tracking-wider">Copied</span>
        </span>
    </div>
);

export const CodeBlockHeader = () => (
    <div className="flex w-full items-center justify-between rounded border border-accent bg-general-background-light px-3 py-2">
        <span className="font-mono text-xs text-primary-text">use-reading-progress.ts</span>
        <span className="flex items-center gap-2 text-accent">
            <CopiedIcon />
            <span className="font-mono text-xs">Copied!</span>
        </span>
    </div>
);
