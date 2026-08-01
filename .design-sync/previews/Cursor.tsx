import { Cursor } from "chicio-blog";

// Cursor is a single underscore driven by the `blink` keyframes (opacity 1 for the first half of a
// 1s cycle, 0 for the second). The capture consistently lands in the invisible half, so every cell
// freezes the animation at frame 0 — the glyph is unchanged, only the blink is held still for the
// static shot.
const FreezeBlink = () => <style>{".ds-blink-still .animate-blink{animation-play-state:paused}"}</style>;

export const Default = () => (
    <div className="ds-blink-still flex gap-2 font-mono text-sm text-accent">
        <FreezeBlink />
        <span>$ npm run build</span>
        <Cursor />
    </div>
);

export const TerminalPrompt = () => (
    <div className="ds-blink-still flex flex-col gap-2 font-mono text-sm text-accent">
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

export const LoadingLine = () => (
    <div className="ds-blink-still flex gap-2 font-mono text-sm text-accent">
        <FreezeBlink />
        <span>&gt; Uploading knowledge...</span>
        <Cursor />
    </div>
);
