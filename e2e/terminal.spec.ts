import { test, expect, type Page } from "@playwright/test";

const acceptConsent = async (page: Page) => {
    const wakeUp = page.getByRole("button", { name: /wake up/i });

    if (await wakeUp.isVisible().catch(() => false)) {
        await wakeUp.click();
        await expect(wakeUp).toBeHidden();
    }
};

const openPalette = async (page: Page) => {
    const trigger = page.getByRole("button", { name: "Open command palette" });
    // The trigger dispatches an open event that sets the palette open (idempotent),
    // so retrying is safe and rides out the post-hydration timing window.
    await expect(async () => {
        await trigger.click();
        await expect(page.getByRole("combobox")).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 20000 });
};

const openTerminalOverlay = async (page: Page) => {
    await openPalette(page);
    const terminalOption = page.getByRole("option", { name: "open terminal" });
    await expect(terminalOption).toBeVisible();
    await terminalOption.click();
    await expect(page.getByRole("dialog", { name: "Terminal" })).toBeVisible();
};

const terminalInput = (page: Page) => page.getByPlaceholder("type a command_");

test.describe("Terminal overlay", () => {
    test("opens in place over the current page, without changing the URL", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);

        await openTerminalOverlay(page);

        await expect(page).toHaveURL("/");
        await expect(terminalInput(page)).toBeFocused();
    });

    test("prints the boot banner", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        await expect(page.getByText(/type "help" for a list of commands/i)).toBeVisible();
    });

    test("open pushes the real URL and renders the page in-shell", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        await expect(async () => {
            await terminalInput(page).fill("open about-me");
            await page.keyboard.press("Enter");
            await expect(page).toHaveURL(/\/about-me/, { timeout: 2000 });
        }).toPass({ timeout: 15000 });

        const dialog = page.getByRole("dialog", { name: "Terminal" });
        await expect(dialog.getByText("─── /about-me ───")).toBeVisible();
        await expect(dialog.getByRole("heading", { name: "About Me", level: 1 })).toBeVisible();
    });

    test("cat renders the page in-shell without touching the URL", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        const dialog = page.getByRole("dialog", { name: "Terminal" });

        await expect(async () => {
            await terminalInput(page).fill("cat about-me");
            await page.keyboard.press("Enter");
            await expect(dialog.getByRole("heading", { name: "About Me", level: 1 })).toBeVisible({ timeout: 2000 });
        }).toPass({ timeout: 15000 });

        await expect(page).toHaveURL("/");
    });

    test("browser Back/Forward mirrors into the shell", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        const dialog = page.getByRole("dialog", { name: "Terminal" });

        await expect(async () => {
            await terminalInput(page).fill("open about-me");
            await page.keyboard.press("Enter");
            await expect(page).toHaveURL(/\/about-me/, { timeout: 2000 });
        }).toPass({ timeout: 15000 });

        await page.goBack();
        await expect(page).toHaveURL("/");
        await expect(terminalInput(page)).toBeVisible();

        await page.goForward();
        await expect(page).toHaveURL(/\/about-me/);
        await expect(dialog.getByRole("heading", { name: "About Me", level: 1 }).last()).toBeVisible();
    });

    test("close reveals the real page at the current URL", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        await expect(async () => {
            await terminalInput(page).fill("open about-me");
            await page.keyboard.press("Enter");
            await expect(page).toHaveURL(/\/about-me/, { timeout: 2000 });
        }).toPass({ timeout: 15000 });

        await terminalInput(page).fill("close");
        await page.keyboard.press("Enter");

        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeHidden();
        await expect(page).toHaveURL(/\/about-me/);
    });

    test("Escape closes the overlay and reveals the real page", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        await page.keyboard.press("Escape");

        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeHidden();
        await expect(page).toHaveURL("/");
    });

    test("the /terminal boot link opens the overlay and keeps the URL sticky at /terminal", async ({ page }) => {
        await page.goto("/terminal");

        await expect(page).toHaveURL("/terminal");
        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeVisible();
        await expect(terminalInput(page)).toBeFocused();
    });

    test("closing the boot link overlay without navigating reveals the real homepage, not the boot stub", async ({
        page,
    }) => {
        await page.goto("/terminal");
        await expect(page).toHaveURL("/terminal");
        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeVisible();

        await page.keyboard.press("Escape");

        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeHidden();
        await expect(page).toHaveURL("/");
        await expect(page.getByText(/Booting the terminal/i)).toHaveCount(0);
        await expect(page.getByRole("heading", { name: "Fabrizio Duroni", level: 1 })).toBeVisible();
    });

    test("opening the site then navigating with open from the boot state does not rewrite the URL on close", async ({
        page,
    }) => {
        await page.goto("/terminal");
        await expect(page).toHaveURL("/terminal");
        await acceptConsent(page);

        await expect(async () => {
            await terminalInput(page).fill("open about-me");
            await page.keyboard.press("Enter");
            await expect(page).toHaveURL(/\/about-me/, { timeout: 2000 });
        }).toPass({ timeout: 15000 });

        await page.keyboard.press("Escape");

        await expect(page.getByRole("dialog", { name: "Terminal" })).toBeHidden();
        await expect(page).toHaveURL(/\/about-me/);
    });

    test("exposes the expected accessibility landmarks", async ({ page }) => {
        await page.goto("/");
        await acceptConsent(page);
        await openTerminalOverlay(page);

        const dialog = page.getByRole("dialog", { name: "Terminal" });
        await expect(dialog).toHaveAttribute("aria-modal", "true");
        await expect(page.getByLabel("Terminal input")).toBeVisible();
        await expect(dialog.locator('[aria-live="polite"]')).toHaveCount(1);
    });
});
