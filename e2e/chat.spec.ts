import { test, expect } from "@playwright/test";

const MOCK_STREAM_RESPONSE = [
    'data: {"type":"text-start","id":"msg-1"}',
    'data: {"type":"text-delta","id":"msg-1","delta":"Hello! I am Fabrizio\'s assistant."}',
    'data: {"type":"text-end","id":"msg-1"}',
    "data: [DONE]",
].join("\n");

test.describe("Chat page", () => {
    test.beforeEach(async ({ page }) => {
        await page.route("**/api/chat", async (route) => {
            await route.fulfill({
                status: 200,
                headers: {
                    "Content-Type": "text/event-stream",
                    "Cache-Control": "no-cache",
                    Connection: "keep-alive",
                },
                body: MOCK_STREAM_RESPONSE,
            });
        });
    });

    test("chat page loads with the welcome header", async ({ page }) => {
        await page.goto("/chat");
        await expect(page.locator("body")).toBeVisible();
        await expect(page).toHaveURL(/\/chat/);
    });

    test("chat page has a message input", async ({ page }) => {
        await page.goto("/chat");
        const input = page.getByRole("textbox");
        await expect(input).toBeVisible();
    });

    test("submitting a message triggers the mocked API and shows a response", async ({ page }) => {
        await page.goto("/chat");
        const input = page.getByRole("textbox");
        await input.fill("Tell me about Fabrizio");
        await page.keyboard.press("Enter");
        await expect(page.getByText("Fabrizio")).toBeVisible({ timeout: 10000 });
    });
});
