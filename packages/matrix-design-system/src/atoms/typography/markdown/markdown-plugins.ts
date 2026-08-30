import remarkEmoji from "remark-emoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

/**
 * Shared by the renderer and by the block splitter in use-markdown-store: the splitter must see the
 * same block-level constructs the renderer does, or it cuts a block in half (display math, tables)
 * and the renderer then never matches it.
 */
export const markdownRemarkPlugins = [remarkGfm, remarkMath, remarkEmoji];
