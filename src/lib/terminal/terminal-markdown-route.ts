/**
 * Builds the direct /markdown/<path> URL for a real site route, fetched
 * client-side by the terminal overlay to render a page in-shell.
 *
 * This intentionally bypasses the `Accept: text/markdown` content-negotiation
 * path in src/proxy.ts (see src/app/markdown/[[...path]]/route.ts) — a direct
 * fetch to /markdown/<path> does not send that header, so the GA4 Measurement
 * Protocol tracking that fires in the proxy middleware for AI-agent markdown
 * requests is NOT triggered by a human using the terminal.
 */
export const toMarkdownFetchUrl = (route: string): string => (route === "/" ? "/markdown" : `/markdown${route}`);
