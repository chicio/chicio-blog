import { test, expect, type Page } from "@playwright/test";

const acceptConsent = async (page: Page) => {
    const wakeUp = page.getByRole("button", { name: /wake up/i });

    if (await wakeUp.isVisible().catch(() => false)) {
        await wakeUp.click();
        await expect(wakeUp).toBeHidden();
    }
};

const KONAMI_KEYS = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "b",
    "a",
];

test.describe("Easter Egg Hunt page", () => {
    test("the Explore nav dropdown links to /easter-egg-hunt", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Explore" }).first().click();
        const menu = page.getByRole("list", { name: "Explore" }).first();
        await expect(menu.getByRole("link", { name: "Easter eggs" })).toHaveAttribute("href", "/easter-egg-hunt");
    });

    test("clicking Easter eggs in the Explore dropdown navigates to the page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Explore" }).first().click();
        const menu = page.getByRole("list", { name: "Explore" }).first();
        await menu.getByRole("link", { name: "Easter eggs" }).click();
        await expect(page).toHaveURL(/\/easter-egg-hunt/);
        await expect(page.getByRole("heading", { name: "Easter Egg Hunt" })).toBeVisible();
    });

    test("loads with no eggs found yet", async ({ page }) => {
        await page.goto("/easter-egg-hunt");
        await expect(page.getByText(/0 \/ 6 easter eggs found/)).toBeVisible();
    });

    test("reveals the solution steps for an egg after clicking reveal", async ({ page }) => {
        await page.goto("/easter-egg-hunt");
        const cardRevealButton = page
            .getByRole("button", { name: /reveal/ })
            .filter({ hasNotText: "all solutions" })
            .first();

        await expect(page.getByText(/The White Rabbit/)).toBeVisible();
        await expect(page.getByText(/Press ⌘K/)).not.toBeVisible();
        await cardRevealButton.click();
        await expect(page.getByText(/Press ⌘K/)).toBeVisible();
    });

    test("triggering the kung-fu egg on the homepage then found count updates on the hunt page", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);

        const dialog = page.getByRole("dialog", { name: "I Know Kung Fu" });

        // Konami-sequence detection hydrates via a dynamic import, so retry the whole
        // sequence (idempotent — it only ever looks at the last 10 keys) to ride out the
        // post-hydration timing window, mirroring the retry pattern in terminal.spec.ts.
        await expect(async () => {
            for (const key of KONAMI_KEYS) {
                await page.keyboard.press(key);
            }
            await expect(dialog).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 20000 });

        const video = dialog.locator("video");
        await expect(video).toHaveAttribute("aria-label", "I Know Kung Fu");
        await expect(video.locator("source")).toHaveAttribute("src", "/media/video/i-know-kung-fu.mp4");

        await page.getByRole("button", { name: "Close" }).click();
        await expect(dialog).not.toBeVisible();

        await page.goto("/easter-egg-hunt");
        await expect(page.getByText(/1 \/ 6 easter eggs found/)).toBeVisible();
    });
});
