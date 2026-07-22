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

test.describe("Terminal page", () => {
    test("loads and focuses the command input", async ({ page }) => {
        await page.goto("/terminal");
        await expect(page).toHaveURL(/\/terminal/);

        const input = page.getByPlaceholder("type a command_");
        await expect(input).toBeVisible();
        await expect(input).toBeFocused();
    });

    test("prints the boot banner hint", async ({ page }) => {
        await page.goto("/terminal");
        await expect(page.getByText(/type "help" for a list of commands/i)).toBeVisible();
    });

    test("help lists the available commands", async ({ page }) => {
        await page.goto("/terminal");
        const input = page.getByPlaceholder("type a command_");
        await input.fill("help");
        await page.keyboard.press("Enter");

        await expect(page.getByText(/list directory contents/)).toBeVisible();
        await expect(page.getByText(/navigate to the real page/)).toBeVisible();
    });

    test("ls lists the top level of the site's virtual filesystem", async ({ page }) => {
        await page.goto("/terminal");
        const input = page.getByPlaceholder("type a command_");

        // ls needs the filesystem.json manifest, fetched client-side on mount; retry the
        // command until it lands rather than racing the fetch on a busy CI runner.
        await expect(async () => {
            await input.fill("ls");
            await page.keyboard.press("Enter");
            await expect(page.getByText("blog/", { exact: true })).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 15000 });

        await expect(page.getByText("about-me", { exact: true })).toBeVisible();
    });

    test("open navigates to the real about-me page", async ({ page }) => {
        await page.goto("/terminal");
        const input = page.getByPlaceholder("type a command_");

        await expect(async () => {
            await input.fill("open about-me");
            await page.keyboard.press("Enter");
            await expect(page).toHaveURL(/\/about-me/, { timeout: 2000 });
        }).toPass({ timeout: 15000 });
    });

    test("search shows matching content results", async ({ page }) => {
        // The store fetches the search index on mount, then parses it into an elasticlunr
        // Index inside a startTransition — the network response resolving does not guarantee
        // that state commit has landed yet, so retry the command until results land.
        const indexResponse = page.waitForResponse("**/search-index.json");
        await page.goto("/terminal");
        await indexResponse;

        const input = page.getByPlaceholder("type a command_");

        await expect(async () => {
            await input.fill("search react native");
            await page.keyboard.press("Enter");
            await expect(page.getByText(/^> /).first()).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 15000 });
    });

    test("exposes the expected accessibility landmarks", async ({ page }) => {
        await page.goto("/terminal");

        const main = page.getByRole("main");
        await expect(main).toBeVisible();
        await expect(page.getByLabel(/\$/)).toBeVisible();
        await expect(main.locator('[aria-live="polite"]')).toHaveCount(1);
    });

    test("can be reached from the command palette", async ({ page }) => {
        await page.goto("/");
        const acceptConsent = page.getByRole("button", { name: /wake up/i });
        await expect(acceptConsent).toBeVisible({ timeout: 15000 });
        await acceptConsent.click();
        await expect(acceptConsent).toBeHidden();

        await openPalette(page);
        const terminalOption = page.getByRole("option", { name: "open terminal" });
        await expect(terminalOption).toBeVisible();
        await terminalOption.click();

        await expect(page).toHaveURL(/\/terminal/);
    });
});
