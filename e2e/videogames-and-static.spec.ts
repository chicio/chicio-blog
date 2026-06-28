import { test, expect } from "@playwright/test";

test.describe("Videogames section", () => {
    test.describe("console listing page", () => {
        test("loads and shows consoles", async ({ page }) => {
            await page.goto("/videogames");
            await expect(page).toHaveURL(/\/videogames/);
            await expect(page.getByRole("heading", { name: /my videogames collection/i, level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: "Nintendo Switch", level: 2 })).toBeVisible();
        });

        test("clicking the Nintendo Switch heading navigates to the console page", async ({ page }) => {
            await page.goto("/videogames");
            await page.getByRole("heading", { name: "Nintendo Switch", level: 2 }).click();
            await expect(page).toHaveURL(/\/videogames\/console\/nintendo-switch/);
            await expect(page.getByRole("heading", { name: "Nintendo Switch", level: 1 })).toBeVisible();
        });
    });

    test.describe("console page", () => {
        test("loads and shows the console heading and hardware specs", async ({ page }) => {
            await page.goto("/videogames/console/nintendo-switch");
            await expect(page).toHaveURL(/\/videogames\/console\/nintendo-switch/);
            await expect(page.getByRole("heading", { name: "Nintendo Switch", level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: /hardware specs/i })).toBeVisible();
        });

        test("shows breadcrumb navigation back to videogames", async ({ page }) => {
            await page.goto("/videogames/console/nintendo-switch");
            await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
            await expect(page.getByRole("link", { name: "Videogames" })).toBeVisible();
        });

        test("shows the Games section", async ({ page }) => {
            await page.goto("/videogames/console/nintendo-switch");
            await expect(page.getByRole("heading", { name: "Games", level: 2 })).toBeVisible();
        });
    });

    test.describe("game page", () => {
        test("loads and renders the game heading", async ({ page }) => {
            await page.goto("/videogames/console/nintendo-switch/game/super-mario-odyssey");
            await expect(page).toHaveURL(/\/videogames\/console\/nintendo-switch\/game\/super-mario-odyssey/);
            await expect(page.getByRole("heading", { name: "Super Mario Odyssey", level: 1 })).toBeVisible();
        });

        test("shows breadcrumb with videogames and console links", async ({ page }) => {
            await page.goto("/videogames/console/nintendo-switch/game/super-mario-odyssey");
            const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
            await expect(breadcrumb.getByRole("link", { name: "Videogames" })).toBeVisible();
            await expect(breadcrumb.getByRole("link", { name: "Nintendo Switch" })).toBeVisible();
        });

        test("returns HTTP 200", async ({ page }) => {
            const response = await page.goto("/videogames/console/nintendo-switch/game/super-mario-odyssey");
            expect(response?.status()).toBe(200);
        });
    });
});

test.describe("Static pages smoke checks", () => {
    test("/about-me loads and returns 200", async ({ page }) => {
        const response = await page.goto("/about-me");
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(/\/about-me/);
        await expect(page.locator("body")).toBeVisible();
    });

    test("/art loads and returns 200", async ({ page }) => {
        const response = await page.goto("/art");
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(/\/art/);
        await expect(page.locator("body")).toBeVisible();
    });

    test("/clowns/photos loads and returns 200", async ({ page }) => {
        const response = await page.goto("/clowns/photos");
        expect(response?.status()).toBe(200);
        await expect(page.locator("body")).toBeVisible();
    });

    test("/cookie-policy loads and shows the policy heading", async ({ page }) => {
        const response = await page.goto("/cookie-policy");
        expect(response?.status()).toBe(200);
        await expect(page).toHaveURL(/\/cookie-policy/);
        await expect(page.getByRole("heading", { name: /cookies policy/i, level: 1 })).toBeVisible();
    });
});
