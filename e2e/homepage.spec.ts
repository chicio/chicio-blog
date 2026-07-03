import { test, expect } from "@playwright/test";

test.describe("Homepage and primary navigation", () => {
    test("homepage loads and displays the site title", async ({ page }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Fabrizio Duroni/i);
        await expect(page.locator("body")).toBeVisible();
    });

    test("homepage contains a menu with navigation links", async ({ page }) => {
        await page.goto("/");
        await expect(page.getByRole("link", { name: /home/i }).first()).toBeVisible();
        await expect(page.getByRole("button", { name: /blog/i }).first()).toBeVisible();
    });

    test("the Blog nav dropdown lists Latest posts, Authors, Tags and Archive", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Blog" }).first().click();
        const menu = page.getByRole("menu").first();
        await expect(menu.getByRole("link", { name: "Latest posts" })).toHaveAttribute("href", "/blog");
        await expect(menu.getByRole("link", { name: "Authors" })).toHaveAttribute("href", "/blog/authors");
        await expect(menu.getByRole("link", { name: "Tags" })).toHaveAttribute("href", "/blog/tags");
        await expect(menu.getByRole("link", { name: "Archive" })).toHaveAttribute("href", "/blog/archive");
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
