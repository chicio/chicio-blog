import { test, expect } from "@playwright/test";

test.describe("Homepage and primary navigation", () => {
    test("homepage loads and displays the site title", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Fabrizio Duroni/i);
        await expect(page.locator("body")).toBeVisible();
    });

    test("homepage contains a navigation element", async ({ page }) => {
        await page.goto("/");
        const nav = page.getByRole("navigation");
        await expect(nav).toBeVisible();
    });

    test("navigating to /blog loads the blog listing page", async ({ page }) => {
        await page.goto("/");
        await page.goto("/blog");
        await expect(page).toHaveURL(/\/blog/);
        await expect(page.locator("body")).toBeVisible();
    });

    test("navigating to /about-me loads the about page", async ({ page }) => {
        await page.goto("/about-me");
        await expect(page).toHaveURL(/\/about-me/);
        await expect(page.locator("body")).toBeVisible();
    });

    test("page returns HTTP 200 for the homepage", async ({ page }) => {
        const response = await page.goto("/");
        expect(response?.status()).toBe(200);
    });
});
