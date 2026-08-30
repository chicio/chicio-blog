/**
 * Markdown rendering, behind its own entry point because it needs the unified/remark/rehype stack.
 *
 * That stack is eight optional peer dependencies and by far the heaviest thing this package can
 * pull in. Keeping it out of the root barrel is what lets a consumer install the design system
 * without any of it. Importing this module is the opt-in.
 */

export * from "./atoms/typography/markdown";
