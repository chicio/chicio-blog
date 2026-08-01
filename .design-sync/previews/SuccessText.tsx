import { SuccessText } from "chicio-blog";

export const Default = () => (
    <div className="flex">
        <SuccessText>&gt; Transfer complete.</SuccessText>
    </div>
);

export const ReadingProgressLines = () => (
    <div className="flex flex-col gap-2 font-mono text-sm">
        <div className="flex">
            <SuccessText>&gt; Uploading knowledge...</SuccessText>
        </div>
        <div className="flex">
            <SuccessText>[████████████████░░░░░░░░]&nbsp;&nbsp;65%</SuccessText>
        </div>
    </div>
);

export const TerminalSession = () => (
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
