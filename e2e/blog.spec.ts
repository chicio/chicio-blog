import { test, expect } from "@playwright/test";

test.describe("Blog section", () => {
    test.describe("listing page", () => {
        test("loads and shows post cards", async ({ page }) => {
            await page.goto("/blog");
            await expect(page).toHaveURL(/\/blog/);
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 3 }).first()).toBeVisible();
        });

        test("shows Read more buttons for posts", async ({ page }) => {
            await page.goto("/blog");
            await expect(page.getByRole("button", { name: /read more/i }).first()).toBeVisible();
        });

        test("clicking a post title navigates to the post page", async ({ page }) => {
            await page.goto("/blog");
            await page.getByRole("heading", { name: "App.js Conf 2026", level: 3 }).first().click();
            await expect(page).toHaveURL(/\/blog\/post\/2026\/06\/01\/app-js-conf-2026/);
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 1 })).toBeVisible();
        });
    });

    test.describe("post page", () => {
        test("renders the post heading and MDX body", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: /some numbers/i })).toBeVisible();
        });

        test("shows breadcrumb navigation back to blog", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
            await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible();
        });

        test("shows post tags", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("link", { name: "react native" }).first()).toBeVisible();
        });

        test("read next section links navigate to another post", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            const readNext = page.getByRole("heading", { name: "Read next", level: 2 }).locator("..");
            await expect(readNext).toBeVisible();
            const firstReadNextPost = readNext.locator('a[href*="/blog/post/"]').first();
            await expect(firstReadNextPost).toBeVisible();
            const startUrl = page.url();
            await firstReadNextPost.click();
            await expect(page).not.toHaveURL(startUrl, { timeout: 10000 });
            await expect(page).toHaveURL(/\/blog\/post\//);
        });
    });

    test.describe("archive page", () => {
        test("loads and lists all posts", async ({ page }) => {
            await page.goto("/blog/archive");
            await expect(page).toHaveURL(/\/blog\/archive/);
            await expect(page.getByRole("heading", { name: "Archive", level: 1 })).toBeVisible();
            await expect(page.getByRole("link", { name: "App.js Conf 2026" })).toBeVisible();
        });

        test("archive links navigate to post pages", async ({ page }) => {
            await page.goto("/blog/archive");
            await page.getByRole("link", { name: "App.js Conf 2026", exact: true }).click();
            await expect(page).toHaveURL(/\/blog\/post\/2026\/06\/01\/app-js-conf-2026/, { timeout: 10000 });
        });
    });

    test.describe("tag page", () => {
        test("loads and shows posts for the tag", async ({ page }) => {
            await page.goto("/blog/tag/react-native");
            await expect(page).toHaveURL(/\/blog\/tag\/react-native/);
            await expect(page.getByRole("heading", { name: /react native/i, level: 1 })).toBeVisible();
            await expect(page.getByRole("link", { name: "App.js Conf 2026" })).toBeVisible();
        });

        test("returns HTTP 200", async ({ page }) => {
            const response = await page.goto("/blog/tag/react-native");
            expect(response?.status()).toBe(200);
        });
    });
});
