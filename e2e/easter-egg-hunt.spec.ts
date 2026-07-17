import { test, expect } from "@playwright/test";

test.describe("Easter Egg Hunt page", () => {
    test("the Blog nav dropdown links to /easter-egg-hunt", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Blog" }).first().click();
        const menu = page.getByRole("menu").first();
        await expect(menu.getByRole("link", { name: "Easter Eggs" })).toHaveAttribute("href", "/easter-egg-hunt");
    });

    test("clicking Easter Eggs in the Blog dropdown navigates to the page", async ({ page }) => {
        await page.goto("/");
        await page.getByRole("button", { name: "Blog" }).first().click();
        const menu = page.getByRole("menu").first();
        await menu.getByRole("link", { name: "Easter Eggs" }).click();
        await expect(page).toHaveURL(/\/easter-egg-hunt/);
        await expect(page.getByRole("heading", { name: "Easter Egg Hunt" })).toBeVisible();
    });

    test("reveals the solution steps for an egg after clicking [reveal]", async ({ page }) => {
        await page.goto("/easter-egg-hunt");
        await expect(page.getByText(/The White Rabbit/)).toBeVisible();
        await expect(page.getByText(/Press ⌘K/)).not.toBeVisible();
        await page.getByRole("button", { name: "[reveal]" }).first().click();
        await expect(page.getByText(/Press ⌘K/)).toBeVisible();
    });
});
