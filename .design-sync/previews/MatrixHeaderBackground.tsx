import { Cursor, MatrixHeaderBackground } from "chicio-blog";

// The Cursor blink is a CSS keyframe animation and the capture freezes the page clock, so an
// unpaused cursor photographs at whatever frame it happens to be in (often the transparent half).
// Pausing it pins it to the 0% keyframe, where it is visible.
const freeze = `.ds-still, .ds-still * { animation-play-state: paused !important; }`;

// The component is an absolutely positioned, -z-10 backdrop: on its own it paints nothing you can
// frame. Each cell gives it a sized positioned box and puts real header content on top of it, the
// way BrandHeader does on every page of the site.
export const Compact = () => (
    <div className="ds-still relative h-64 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={false} />
        <div className="flex items-center pt-6">
            <div className="glassmorphism-lite-no-scale z-30 w-full p-5">
                <span className="text-accent m-0 block font-mono text-2xl font-bold uppercase text-shadow-lg">
                    <span className="text-shadow-md">{"> "}</span>CHICIO CODING
                    <Cursor />
                </span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md">
                    Pixels. Code. Unplugged.
                </span>
            </div>
        </div>
    </div>
);

export const Big = () => (
    <div className="ds-still relative h-96 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={true} />
        <div className="flex items-center pt-8">
            <div className="glassmorphism-lite-no-scale z-30 w-full p-5">
                <span className="text-accent m-0 block font-mono text-2xl font-bold uppercase text-shadow-lg">
                    <span className="text-shadow-md">{"> "}</span>CHICIO CODING
                    <Cursor />
                </span>
                <span className="text-primary-text font-mono text-xs font-normal text-shadow-md">
                    Pixels. Code. Unplugged.
                </span>
            </div>
        </div>
    </div>
);

export const BehindAPageTitle = () => (
    <div className="ds-still relative h-64 w-full overflow-hidden">
        <style>{freeze}</style>
        <MatrixHeaderBackground big={false} />
        <div className="flex flex-col gap-3 pt-8">
            <span className="text-accent font-mono text-2xl font-bold uppercase text-shadow-lg">
                Data structures
            </span>
            <span className="text-primary-text font-mono text-sm font-bold text-shadow-md">
                {"> "}96 articles · 287 lessons
                <Cursor />
            </span>
        </div>
    </div>
);
