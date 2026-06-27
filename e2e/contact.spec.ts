import { test, expect } from "@playwright/test";

test.describe("Contact form with mocked API", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/api/contact", async (route) => {
            await route.fulfill({
                status: 200,
                contentType: "application/json",
                body: JSON.stringify({ success: true }),
            });
        });
    });

    test("contact page loads with the form", async ({ page }) => {
        await page.goto("/contact");
        await expect(page).toHaveURL(/\/contact/);
        await expect(page.getByRole("textbox", { name: /name/i })).toBeVisible();
        await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
    });

    test("shows validation error when submitting empty form", async ({ page }) => {
        await page.goto("/contact");
        const submitButton = page.getByRole("button", { name: /send message/i });
        await submitButton.click();
        await expect(page.getByText(/required|incomplete|error/i)).toBeVisible({ timeout: 5000 });
    });

    test("shows validation error for invalid email", async ({ page }) => {
        await page.goto("/contact");
        await page.getByRole("textbox", { name: /name/i }).fill("Fabrizio");
        await page.getByRole("textbox", { name: /email/i }).fill("not-an-email");
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByText(/invalid|email|required|error/i)).toBeVisible({ timeout: 5000 });
    });

    test("successfully submits a valid form and shows confirmation", async ({ page }) => {
        await page.goto("/contact");
        await page.getByRole("textbox", { name: /name/i }).fill("Test User");
        await page.getByRole("textbox", { name: /email/i }).fill("test@example.com");
        await page.locator("textarea").fill("This is a test message that is long enough.");
        await page.getByRole("button", { name: /send message/i }).click();
        await expect(page.getByText(/sent|success|confirmation/i)).toBeVisible({ timeout: 10000 });
    });
});
