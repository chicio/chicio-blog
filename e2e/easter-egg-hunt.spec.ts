import { test, expect, type Page } from "@playwright/test";

const acceptConsent = async (page: Page) => {
    // The cookie-consent banner is client-rendered, so waiting for it confirms the page
    // has hydrated and clears its overlay before we interact with the nav dropdowns.
    const wakeUp = page.getByRole("button", { name: /wake up/i });
    await expect(wakeUp).toBeVisible({ timeout: 15000 });
    await wakeUp.click();
    await expect(wakeUp).toBeHidden();
};

test.describe("Easter Egg Hunt page", () => {
    test("the Explore nav dropdown links to /easter-egg-hunt", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await page.getByRole("button", { name: "Explore" }).first().click();
        const menu = page.getByRole("list", { name: "Explore" }).first();
        await expect(menu.getByRole("link", { name: "Easter eggs" })).toHaveAttribute("href", "/easter-egg-hunt");
    });

    test("clicking Easter eggs in the Explore dropdown navigates to the page", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await page.getByRole("button", { name: "Explore" }).first().click();
        const menu = page.getByRole("list", { name: "Explore" }).first();
        await menu.getByRole("link", { name: "Easter eggs" }).click();
        await expect(page).toHaveURL(/\/easter-egg-hunt/);
        await expect(page.getByRole("heading", { name: "Easter Egg Hunt" })).toBeVisible();
    });

    test("reveals the solution steps for an egg after clicking reveal", async ({ page }) => {
        await page.goto("/easter-egg-hunt");
        await expect(page.getByText(/The White Rabbit/)).toBeVisible();
        await expect(page.getByText(/Press ⌘K/)).not.toBeVisible();
        await page.getByRole("button", { name: /reveal/ }).first().click();
        await expect(page.getByText(/Press ⌘K/)).toBeVisible();
    });
});
