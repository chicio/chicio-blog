import { test, expect, type Locator } from "@playwright/test";

const openLightboxViaClick = async (trigger: Locator, dialog: Locator) => {
    await expect(async () => {
        await trigger.click();
        await expect(dialog).toBeVisible({ timeout: 1000 });
    }).toPass();
};

test.describe("Global image lightbox", () => {
    test.describe("blog post content images", () => {
        test("clicking a content image opens the lightbox and Esc closes it", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");

            const contentImage = page.locator('img[alt*="App.js Conf 2026"]').first();
            await expect(contentImage).toBeVisible();
            const imageSrc = await contentImage.getAttribute("src");

            const dialog = page.locator('[role="dialog"][aria-modal="true"]');
            await openLightboxViaClick(contentImage, dialog);
            await expect(dialog.locator("img")).toHaveAttribute("src", imageSrc ?? "");

            await page.keyboard.press("Escape");
            await expect(dialog).not.toBeVisible();
        });
    });

    test.describe("art page", () => {
        test("renders a grid and clicking a tile opens the lightbox", async ({ page }) => {
            await page.goto("/art");

            const tiles = page.locator("figure img");
            await expect(tiles.first()).toBeVisible();
            const tileCount = await tiles.count();
            expect(tileCount).toBeGreaterThan(1);

            const dialog = page.locator('[role="dialog"][aria-modal="true"]');
            await openLightboxViaClick(tiles.first(), dialog);
            await expect(dialog.locator("img")).toBeVisible();

            await page.getByRole("button", { name: "Close lightbox" }).click();
            await expect(dialog).not.toBeVisible();
        });
    });
});
