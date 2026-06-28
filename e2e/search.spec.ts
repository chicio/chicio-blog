import { test, expect, type Page } from "@playwright/test";

const openPalette = async (page: Page) => {
    const trigger = page.getByRole("button", { name: "Open command palette" });
    // The trigger dispatches an open event that sets the palette open (idempotent),
    // so retrying is safe and rides out the post-hydration timing window.
    await expect(async () => {
        await trigger.click();
        await expect(page.getByRole("combobox")).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20000 });
};

// Opens the palette and waits for the client-side search index to finish loading,
// so a query runs against a populated index rather than an empty one.
const openPaletteWithIndex = async (page: Page) => {
    const indexResponse = page.waitForResponse("**/search-index.json");
    await openPalette(page);
    await indexResponse;
};

test.describe("Command palette search", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/blog");
        // The cookie-consent banner is client-rendered, so waiting for it confirms the page
        // has hydrated and clears its overlay before we drive the palette.
        const acceptConsent = page.getByRole("button", { name: /wake up/i });
        await expect(acceptConsent).toBeVisible({ timeout: 15000 });
        await acceptConsent.click();
        await expect(acceptConsent).toBeHidden();
    });

    test("command palette opens from the menu trigger", async ({ page }) => {
        await openPalette(page);
    });

    test("typing a query shows search results in the listbox", async ({ page }) => {
        await openPaletteWithIndex(page);
        await page.getByRole("combobox").pressSequentially("react", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox).toBeVisible({ timeout: 5000 });
        await expect(listbox.getByRole("option").first()).toBeVisible({ timeout: 10000 });
    });

    test("search results include posts matching the query", async ({ page }) => {
        await openPaletteWithIndex(page);
        await page.getByRole("combobox").pressSequentially("react", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox.getByRole("option").first()).toBeVisible({ timeout: 10000 });
        await expect(listbox).toContainText(/react/i, { timeout: 10000 });
    });

    test("selecting a result navigates to the matching post", async ({ page }) => {
        await openPaletteWithIndex(page);
        await page.getByRole("combobox").pressSequentially("react native", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox.getByRole("option").first()).toBeVisible({ timeout: 10000 });
        await listbox.getByRole("option").first().click();
        await expect(page).toHaveURL(/\/blog\/post\//, { timeout: 10000 });
    });

    test("palette closes when Escape is pressed", async ({ page }) => {
        await openPalette(page);
        await page.keyboard.press("Escape");
        await expect(page.getByRole("combobox")).not.toBeVisible({ timeout: 5000 });
    });
});
