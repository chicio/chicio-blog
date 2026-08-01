import { Button, CopyIcon } from "chicio-blog";

// CopyIcon is a fixed 16px glyph that inherits its colour, so on its own it needs a coloured flex
// row to be legible; the other cells show it where it actually lives, inside a code-block button.
export const Default = () => (
    <div className="text-accent flex items-center gap-2 font-mono text-sm">
        <CopyIcon />
        <span>Copy code</span>
    </div>
);

export const InCopyButton = () => (
    <div className="flex">
        <Button className="text-primary!" aria-label="Copy code">
            <CopyIcon />
        </Button>
    </div>
);

export const OnCodeBlock = () => (
    <div className="glow-container bg-general-background-light relative max-w-[500px] p-4">
        <Button className="text-primary! absolute top-2 right-2 p-2!" aria-label="Copy code">
            <CopyIcon />
        </Button>
        <div className="text-primary-text font-mono text-sm leading-relaxed">
            <div>const posts = await getAllPosts();</div>
            <div>return posts.slice(0, 5);</div>
        </div>
    </div>
);
