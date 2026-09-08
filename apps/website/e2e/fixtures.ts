import { test as base, expect } from "@playwright/test";

/**
 * Every spec must import `test` from here rather than from `@playwright/test`, so that the whole
 * suite runs with `/_next/image` rewritten to the source file it optimizes.
 *
 * Next's on-demand image optimizer deadlocks a cache key for the remaining life of the server
 * process as soon as one client abandons a `/_next/image` request before it has been served.
 * `fetchInternalImage` reads the source file through a mocked request that carries the *real*
 * client socket, so `send`'s on-finished listener fires on that socket's `close`, destroys the
 * file stream, and the mocked response never emits `finish`. The promise the response cache
 * stores for that key therefore never settles, and — because the cache dedupes by key — every
 * later request for the same image joins the same pending promise and hangs forever.
 *
 * Playwright abandons exactly those requests whenever a test ends while a page is still loading
 * its images, which the short assertions on /blog/authors do on nearly every run. The next test
 * to render those avatars then has six hung requests in flight at once, which is Chrome's entire
 * per-origin socket budget, so the RSC payload for a clicked link is queued behind them and never
 * arrives: the click lands, nothing navigates, and `toHaveURL` times out. That was the
 * /blog/authors → /about-me failure, and it reproduces on demand — after two aborted page loads,
 * four to eight avatars stop responding to plain curl for as long as the server lives.
 *
 * Rewriting the request to its source keeps real image bytes in the page and leaves the
 * production build untouched; it only takes the optimizer out of the loop, where nothing in this
 * suite asserts on it and any request can poison the run.
 *
 * The route goes on the CONTEXT, not the page, and that is the whole point rather than a detail.
 * A page route leaves service-worker fetches alone, and pwa.spec.ts opts service workers back in:
 * with `page.route` that spec still drove 16 requests into the optimizer, and against pre-poisoned
 * keys its `page.reload()` hung until the 30s test timeout. On the context the worker's fetches are
 * intercepted too, and the whole suite now reaches the optimizer exactly zero times.
 */
export const test = base.extend({
    context: async ({ context }, use) => {
        await context.route("**/_next/image**", async (route) => {
            const requestUrl = route.request().url();
            const source = new URL(requestUrl).searchParams.get("url");

            if (source === null || !source.startsWith("/")) {
                await route.fallback();
                return;
            }

            await route.continue({ url: new URL(source, requestUrl).toString() });
        });

        await use(context);
    },
});

export { expect };
export type { Locator, Page } from "@playwright/test";
