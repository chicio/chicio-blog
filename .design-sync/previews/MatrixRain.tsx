import { Cursor, MatrixRain, TerminalLine } from "chicio-blog";

// The Cursor blink is a CSS keyframe animation and the capture freezes the page clock, so an
// unpaused cursor photographs at whatever frame it happens to be in (often the transparent half).
// Pausing it pins it to the 0% keyframe, where it is visible.
const freeze = `.ds-still, .ds-still * { animation-play-state: paused !important; }`;

// MatrixRain paints into the nearest positioned ancestor and contributes no layout of its own, so
// every cell gives it a sized box. WebGPU is unavailable in headless Chromium, so what is captured
// here is the 2D canvas fallback the component ships with.
export const Default = () => (
    <div className="border-accent relative h-64 w-full overflow-hidden border">
        <MatrixRain />
    </div>
);

export const BehindContent = () => (
    <div className="border-accent ds-still relative flex h-64 w-full items-center justify-center overflow-hidden border">
        <style>{freeze}</style>
        <MatrixRain />
        <span className="text-accent z-10 font-mono text-2xl font-bold uppercase text-shadow-lg">
            Wake up, Neo
            <Cursor />
        </span>
    </div>
);

export const TerminalBackdrop = () => (
    <div className="border-accent ds-still relative h-64 w-full overflow-hidden border">
        <style>{freeze}</style>
        <MatrixRain />
        <div className="glassmorphism-lite-no-scale relative z-10 m-4 p-4">
            <TerminalLine>{"> "}npm run dev</TerminalLine>
            <TerminalLine>{"> "}search index generated — 514 documents</TerminalLine>
            <TerminalLine>
                {"> "}ready on http://localhost:3000
                <Cursor />
            </TerminalLine>
        </div>
    </div>
);
