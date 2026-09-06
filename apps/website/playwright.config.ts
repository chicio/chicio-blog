import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [["html", { open: "never" }], ["list"]],
    use: {
        baseURL: "http://localhost:3000",
        trace: "on-first-retry",
        // The root layout registers a Serwist service worker on every page, and nothing in this
        // suite exercises it. Left enabled it installs mid-test: traces from the two CI failures
        // show `/sw.js` loading and then, 95ms and 207ms later, every subsequent request ceasing to
        // complete — zero of them, permanently — so the router never received the RSC payload for
        // the clicked link and the URL never changed. Both failures were a click shortly after
        // load, which is exactly the activation window. Blocking it removes the race; PWA
        // behaviour is no less covered than before, since no test asserted on it.
        serviceWorkers: "block",
    },
    projects: [
        {
            name: "chromium",
            use: { ...devices["Desktop Chrome"] },
        },
    ],
    webServer: {
        command: "npm run build && npm run start",
        url: "http://localhost:3000",
        timeout: 300 * 1000,
        reuseExistingServer: !process.env.CI,
    },
});
