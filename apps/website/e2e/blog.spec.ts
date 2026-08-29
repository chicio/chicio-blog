import { test, expect } from "@playwright/test";

test.describe("Blog section", () => {
    test.describe("listing page", () => {
        test("loads and shows post cards", async ({ page }) => {
            await page.goto("/blog");
            await expect(page).toHaveURL(/\/blog/);
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 3 }).first()).toBeVisible();
        });

        test("shows Read more buttons for posts", async ({ page }) => {
            await page.goto("/blog");
            await expect(page.getByRole("button", { name: /read more/i }).first()).toBeVisible();
        });

        test("clicking a post title navigates to the post page", async ({ page }) => {
            await page.goto("/blog");
            await page.getByRole("heading", { name: "App.js Conf 2026", level: 3 }).first().click();
            await expect(page).toHaveURL(/\/blog\/post\/2026\/06\/01\/app-js-conf-2026/);
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 1 })).toBeVisible();
        });
    });

    test.describe("post page", () => {
        test("renders the post heading and MDX body", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("heading", { name: "App.js Conf 2026", level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: /some numbers/i })).toBeVisible();
        });

        test("shows breadcrumb navigation back to blog", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
            await expect(page.getByRole("link", { name: "Blog" }).first()).toBeVisible();
        });

        test("shows post tags", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("link", { name: "react native" }).first()).toBeVisible();
        });

        test("read next section links navigate to another post", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            const readNext = page.getByRole("heading", { name: "read next", level: 2 }).locator("../..");
            await expect(readNext).toBeVisible();
            const firstReadNextPost = readNext.locator('a[href*="/blog/post/"]').first();
            await expect(firstReadNextPost).toBeVisible();
            const startUrl = page.url();
            await firstReadNextPost.click();
            await expect(page).not.toHaveURL(startUrl, { timeout: 10000 });
            await expect(page).toHaveURL(/\/blog\/post\//);
        });

        test("renders the giscus live comments widget", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.locator("giscus-widget")).toBeAttached();
        });
    });

    test.describe("comments", () => {
        test("a legacy post shows the archived comments section above the giscus widget", async ({ page }) => {
            await page.goto("/blog/post/2020/06/02/dynamic-imports-webpack-chunks");
            await expect(page.getByRole("heading", { name: "Archived comments", level: 2 })).toBeVisible();
            await expect(page.getByText("Iftikhar Ali", { exact: true })).toBeVisible();
            await expect(page.locator("giscus-widget")).toBeAttached();
        });

        test("a non-legacy post shows no archived comments section", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            await expect(page.getByRole("heading", { name: "Archived comments", level: 2 })).toHaveCount(0);
        });
    });

    test.describe("archive page", () => {
        test("loads and lists all posts", async ({ page }) => {
            await page.goto("/blog/archive");
            await expect(page).toHaveURL(/\/blog\/archive/);
            await expect(page.getByRole("heading", { name: "Archive", level: 1 })).toBeVisible();
            await expect(page.getByRole("link", { name: "App.js Conf 2026" })).toBeVisible();
        });

        test("archive links navigate to post pages", async ({ page }) => {
            await page.goto("/blog/archive");
            await page.getByRole("link", { name: "App.js Conf 2026", exact: true }).click();
            await expect(page).toHaveURL(/\/blog\/post\/2026\/06\/01\/app-js-conf-2026/, { timeout: 10000 });
        });
    });

    test.describe("authors index page", () => {
        test("loads and lists authors with at least one post", async ({ page }) => {
            await page.goto("/blog/authors");
            await expect(page).toHaveURL(/\/blog\/authors/);
            await expect(page.getByRole("heading", { name: "Authors", level: 1 })).toBeVisible();
            await expect(page.getByRole("link", { name: /Fabrizio Duroni/ })).toBeVisible();
        });

        test("filtering by name narrows the visible author cards", async ({ page }) => {
            await page.goto("/blog/authors");
            await page.getByRole("textbox").fill("nonexistent-author-xyz");
            await expect(page.getByText(/No authors found for/)).toBeVisible();
        });

        test("clicking the site owner's author card navigates to the about-me page", async ({ page }) => {
            await page.goto("/blog/authors");
            await page.getByRole("link", { name: /Fabrizio Duroni/ }).first().click();
            await expect(page).toHaveURL(/\/about-me/);
        });
    });

    test.describe("author detail page", () => {
        test("loads and shows a non-owner author profile and their posts", async ({ page }) => {
            await page.goto("/blog/author/antonino-gitto");
            await expect(page).toHaveURL(/\/blog\/author\/antonino-gitto/);
            await expect(page.getByRole("link", { name: "LinkedIn", exact: true })).toHaveAttribute(
                "href",
                "https://www.linkedin.com/in/antonino-gitto/",
            );
            await expect(page.getByRole("heading", { name: /Posts published/ })).toBeVisible();
            await expect(page.locator('a[href*="/blog/post/"]').first()).toBeVisible();
        });

        test("returns HTTP 200 for a non-owner author", async ({ page }) => {
            const response = await page.goto("/blog/author/antonino-gitto");
            expect(response?.status()).toBe(200);
        });

        test("the site owner's author detail page 404s (about-me replaces it)", async ({ page }) => {
            const response = await page.goto("/blog/author/fabrizio-duroni");
            expect(response?.status()).toBe(404);
        });

        test("the post byline links the site owner to the about-me page", async ({ page }) => {
            await page.goto("/blog/post/2026/06/01/app-js-conf-2026");
            const authorLink = page.getByRole("link", { name: "Fabrizio Duroni" }).first();
            await expect(authorLink).toHaveAttribute("href", "/about-me");
        });
    });

    test.describe("tag page", () => {
        test("loads and shows posts for the tag", async ({ page }) => {
            await page.goto("/blog/tag/react-native");
            await expect(page).toHaveURL(/\/blog\/tag\/react-native/);
            await expect(page.getByRole("heading", { name: /react native/i, level: 1 })).toBeVisible();
            await expect(page.getByRole("link", { name: "App.js Conf 2026" })).toBeVisible();
        });

        test("returns HTTP 200", async ({ page }) => {
            const response = await page.goto("/blog/tag/react-native");
            expect(response?.status()).toBe(200);
        });
    });
});
