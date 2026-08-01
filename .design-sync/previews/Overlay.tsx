import { Chip, Cursor, Overlay, PageTitle, TerminalLine } from "chicio-blog";

// Capture-stability shim, not styling. The capture screenshots after networkidle with the page clock
// frozen, so framer-motion's fade-in (initial opacity 0 -> 1) never advances and the whole overlay
// photographs as if it were not mounted. An !important author rule outranks both the inline
// `opacity: 0` framer writes and the WAAPI animation, pinning the overlay to its settled state; the
// paused rule does the same for the Cursor blink keyframes.
const freeze = `
.ds-overlay-still { opacity: 1 !important; }
.ds-overlay-still * { animation-play-state: paused !important; }
`;

export const DimmedContent = () => (
    <>
        <style>{freeze}</style>
        <div className="flex h-72 flex-col gap-2">
            <PageTitle>Data structures and algorithms</PageTitle>
            <p className="text-primary-text">
                A complete course, from arrays and hash maps up to graphs and dynamic programming.
            </p>
            <div className="flex flex-wrap gap-2">
                <Chip>Graph</Chip>
                <Chip>Binary search</Chip>
            </div>
        </div>
        <Overlay delay={0} className="ds-overlay-still" />
    </>
);

export const WithDialog = () => (
    <>
        <style>{freeze}</style>
        <div className="flex h-72 flex-col gap-2">
            <PageTitle>Blog</PageTitle>
            <p className="text-primary-text">Pixels. Code. Unplugged.</p>
        </div>
        <Overlay delay={0} className="ds-overlay-still">
            <div className="flex h-full w-full items-center justify-center p-4">
                <div className="glassmorphism-lite-no-scale w-full max-w-md p-4">
                    <TerminalLine>{"> "}Open the command palette?</TerminalLine>
                    <TerminalLine>{"> "}Press ⌘K to search 514 pages.</TerminalLine>
                </div>
            </div>
        </Overlay>
    </>
);

export const WithTerminal = () => (
    <>
        <style>{freeze}</style>
        <div className="flex h-72 flex-col gap-2">
            <PageTitle>Terminal</PageTitle>
            <p className="text-primary-text">A Unix-like shell over the whole site.</p>
        </div>
        <Overlay delay={0} className="ds-overlay-still">
            <div className="flex h-full w-full items-center justify-center p-4">
                <div className="glow-border w-full max-w-md p-4">
                    <TerminalLine>{"> "}cd /blog</TerminalLine>
                    <TerminalLine>{"> "}ls</TerminalLine>
                    <TerminalLine>
                        {"> "}open swiftui-path-and-shape.mdx
                        <Cursor />
                    </TerminalLine>
                </div>
            </div>
        </Overlay>
    </>
);
