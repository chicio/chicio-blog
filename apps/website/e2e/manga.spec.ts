import { test, expect, type Page } from "./fixtures";

/** Vertical space between the badges row (right under the title) and the element that follows it. */
const gapBelowBadges = (page: Page) =>
    page.locator("h1").evaluate((title) => {
        const badges = title.nextElementSibling!;
        return badges.nextElementSibling!.getBoundingClientRect().top - badges.getBoundingClientRect().bottom;
    });

test.describe("Manga section", () => {
    test.describe("collection page", () => {
        test("loads and shows the title, the stats and one card per Manga", async ({ page }) => {
            const response = await page.goto("/manga");
            expect(response?.status()).toBe(200);
            await expect(page.getByRole("heading", { name: /my manga collection/i, level: 1 })).toBeVisible();
            await expect(page.getByText("Volumes", { exact: true })).toBeVisible();
            await expect(page.getByRole("link", { name: /Demon Slayer/ })).toBeVisible();
            await expect(page.getByRole("link", { name: /Death Note/ })).toBeVisible();
        });

        test("shows owned over total on each card, with a check mark when complete", async ({ page }) => {
            await page.goto("/manga");
            await expect(page.getByRole("link", { name: /Demon Slayer/ })).toContainText("23/23 ✓");
            await expect(page.getByRole("link", { name: /Death Note/ })).toContainText("1/1 ✓");
        });

        test("filtering by title keeps only the matching Manga", async ({ page }) => {
            await page.goto("/manga");
            await page.getByRole("textbox", { name: "Search manga..." }).fill("death");
            await expect(page.getByRole("link", { name: /Death Note/ })).toBeVisible();
            await expect(page.getByRole("link", { name: /Demon Slayer/ })).toHaveCount(0);
        });

        test("filtering with no match shows the empty state naming the query", async ({ page }) => {
            await page.goto("/manga");
            await page.getByRole("textbox", { name: "Search manga..." }).fill("zzz");
            await expect(page.getByText(/No manga found for/)).toContainText("zzz");
        });

        test("clicking a card opens the Manga page", async ({ page }) => {
            await page.goto("/manga");
            await page.getByRole("link", { name: /Demon Slayer/ }).click();
            await expect(page).toHaveURL(/\/manga\/demon-slayer$/);
            await expect(page.getByRole("heading", { name: /Demon Slayer/, level: 1 })).toBeVisible();
        });
    });

    test.describe("Manga page", () => {
        test("loads and renders the heading, returning HTTP 200", async ({ page }) => {
            const response = await page.goto("/manga/death-note");
            expect(response?.status()).toBe(200);
            await expect(page.getByRole("heading", { name: /Death Note/, level: 1 })).toBeVisible();
        });

        test("shows a breadcrumb back to the Manga collection", async ({ page }) => {
            await page.goto("/manga/death-note");
            const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
            await expect(breadcrumb.getByRole("link", { name: "Manga" })).toBeVisible();
            await breadcrumb.getByRole("link", { name: "Manga" }).click();
            await expect(page).toHaveURL(/\/manga$/);
        });

        test("shows the metadata pills and the plot summary", async ({ page }) => {
            await page.goto("/manga/death-note");
            await expect(page.getByText("Story by:")).toBeVisible();
            await expect(page.getByText("Tsugumi Ohba").first()).toBeVisible();
            await expect(page.getByText("Volumes owned:")).toBeVisible();
            await expect(page.getByRole("heading", { name: "Plot", level: 2 })).toBeVisible();
        });

        test("shows the carousel written in the MDX, holding the cover while there are no shelf photos", async ({
            page,
        }) => {
            await page.goto("/manga/death-note");
            await expect(
                page.locator("img[src*='death-note%2Fcover.jpg'], img[src*='death-note/cover.jpg']").first(),
            ).toBeVisible();
        });

        test("leaves space between the badges and the carousel", async ({ page }) => {
            await page.goto("/manga/death-note");
            expect(await gapBelowBadges(page)).toBeGreaterThanOrEqual(16);
        });

        test("shows the carousel before the information pills", async ({ page }) => {
            await page.goto("/manga/death-note");
            const carousel = page
                .locator("img[src*='death-note%2Fcover.jpg'], img[src*='death-note/cover.jpg']")
                .first();
            const firstPill = page.getByText("Story by:");
            await expect(carousel).toBeVisible();
            await expect(firstPill).toBeVisible();
            const carouselBox = await carousel.boundingBox();
            const pillBox = await firstPill.boundingBox();
            expect(carouselBox!.y).toBeLessThan(pillBox!.y);
        });

        test("links to the sibling Manga with the previous and next pills", async ({ page }) => {
            await page.goto("/manga/death-note");
            await expect(page.getByRole("link", { name: "Demon Slayer: Kimetsu no Yaiba" }).last()).toBeVisible();
            await page.getByRole("link", { name: "Demon Slayer: Kimetsu no Yaiba" }).last().click();
            await expect(page).toHaveURL(/\/manga\/demon-slayer$/);
            await expect(page.getByRole("link", { name: "Death Note Complete Edition" }).last()).toBeVisible();
        });

        test("returns 404 for a Manga that does not exist", async ({ page }) => {
            const response = await page.goto("/manga/not-a-manga");
            expect(response?.status()).toBe(404);
        });
    });
});
