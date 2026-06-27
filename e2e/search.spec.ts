import { test, expect } from "@playwright/test";

test.describe("Command palette search", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/blog");
        await page.waitForLoadState("networkidle");
        const consentDialog = page.getByRole("dialog", { name: /cookie consent/i });
        if (await consentDialog.isVisible()) {
            await page.getByRole("button", { name: /wake up/i }).click();
        }
    });

    test("command palette opens when the trigger button is clicked", async ({ page }) => {
        await page.getByRole("button", { name: "Open command palette" }).click();
        await expect(page.getByRole("combobox")).toBeVisible({ timeout: 10000 });
    });

    test("typing a query shows search results in the listbox", async ({ page }) => {
        const searchIndexPromise = page.waitForResponse("**/search-index.json");
        await page.getByRole("button", { name: "Open command palette" }).click();
        const combobox = page.getByRole("combobox");
        await expect(combobox).toBeVisible({ timeout: 10000 });
        await searchIndexPromise;
        await page.waitForTimeout(300);
        await combobox.pressSequentially("react", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox).toBeVisible({ timeout: 5000 });
        await expect(listbox.getByRole("option").first()).toBeVisible({ timeout: 10000 });
    });

    test("search results include posts matching the query", async ({ page }) => {
        const searchIndexPromise = page.waitForResponse("**/search-index.json");
        await page.getByRole("button", { name: "Open command palette" }).click();
        const combobox = page.getByRole("combobox");
        await expect(combobox).toBeVisible({ timeout: 10000 });
        await searchIndexPromise;
        await page.waitForTimeout(300);
        await combobox.pressSequentially("react", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox).toBeVisible({ timeout: 5000 });
        await expect(listbox.getByRole("option").first()).toContainText(/react/i, { timeout: 10000 });
    });

    test("selecting a result navigates to the matching post", async ({ page }) => {
        const searchIndexPromise = page.waitForResponse("**/search-index.json");
        await page.getByRole("button", { name: "Open command palette" }).click();
        const combobox = page.getByRole("combobox");
        await expect(combobox).toBeVisible({ timeout: 10000 });
        await searchIndexPromise;
        await page.waitForTimeout(300);
        await combobox.pressSequentially("react native", { delay: 50 });
        const listbox = page.getByRole("listbox", { name: "Suggestions" });
        await expect(listbox.getByRole("option").first()).toBeVisible({ timeout: 10000 });
        await listbox.getByRole("option").first().click();
        await expect(page).toHaveURL(/\/blog\/post\//, { timeout: 10000 });
    });

    test("palette closes when Escape is pressed", async ({ page }) => {
        await page.getByRole("button", { name: "Open command palette" }).click();
        const combobox = page.getByRole("combobox");
        await expect(combobox).toBeVisible({ timeout: 10000 });
        await page.keyboard.press("Escape");
        await expect(page.getByRole("combobox")).not.toBeVisible({ timeout: 5000 });
    });
});
