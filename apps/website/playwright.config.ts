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
        // The root layout registers a Serwist service worker on every page, and only pwa.spec.ts
        // exercises it — it opts back in with `test.use({ serviceWorkers: "allow" })`. Everywhere
        // else it is noise that installs mid-test, so it stays blocked.
        //
        // It was also blamed, on the evidence of two traces, for the "every subsequent request
        // stops completing, permanently, so the clicked link never navigates" failures. That was
        // the wrong culprit: the same symptom came back with the worker blocked, and the cause is
        // Next's image optimizer deadlocking on abandoned requests. `e2e/fixtures.ts` documents it
        // and routes around it — a fix that needs a page, so it is a fixture rather than an option
        // here, and every spec imports `test` from there rather than from `@playwright/test`.
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
