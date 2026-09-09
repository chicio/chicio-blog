import { test, expect, type Page } from "./fixtures";

// The suite blocks service workers by default (see playwright.config.ts): the root layout registers
// one on every page, and a test that neither blocks nor waits for it races its activation, which is
// what made two CI runs fail. These tests want the real thing, so they opt back in and then wait for
// the exact condition rather than racing it.
test.use({ serviceWorkers: "allow" });

// `clientsClaim` is set in sw.ts, so the worker takes over the page that registered it. Waiting for
// a non-null controller is the deterministic signal that it is now serving this page's requests.
const waitForServiceWorker = (page: Page) =>
    page.waitForFunction(() => navigator.serviceWorker?.controller != null, undefined, { timeout: 30_000 });

test.describe("Progressive web app", () => {
    test.describe("service worker registration", () => {
        test("registers and takes control of the page", async ({ page }) => {
            await page.goto("/");
            await waitForServiceWorker(page);

            const registrations = await page.evaluate(
                async () => (await navigator.serviceWorker.getRegistrations()).length,
            );
            expect(registrations).toBeGreaterThan(0);
        });
    });

    test.describe("offline behaviour", () => {
        test("serves an already-visited page from cache while offline", async ({ page, context }) => {
            await page.goto("/about-me");
            await waitForServiceWorker(page);
            // The first load happened before the worker controlled the page, so it never reached the
            // NetworkFirst handler. Reloading puts the page in the "pages" cache.
            await page.reload();

            await context.setOffline(true);
            await page.reload();

            // A real heading from the page itself, not just a 200: this also proves the offline
            // fallback did not stand in for it.
            await expect(page.getByRole("heading", { name: "Biography", level: 2 })).toBeVisible();
        });

        test("falls back to the offline page for a route never visited", async ({ page, context }) => {
            await page.goto("/");
            await waitForServiceWorker(page);

            await context.setOffline(true);
            await page.goto("/blog/authors");

            await expect(page.getByRole("heading", { name: "OFFLINE", level: 1 })).toBeVisible();
        });
    });
});
