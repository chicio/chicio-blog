import { test, expect } from "@playwright/test";

test.describe("Data Structures and Algorithms section", () => {
    test.describe("roadmap page", () => {
        test("loads and shows the topic table", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/roadmap");
            await expect(page).toHaveURL(/\/data-structures-and-algorithms\/roadmap/);
            await expect(page.getByRole("heading", { name: "Data Structures and Algorithms", level: 1 })).toBeVisible();
            await expect(page.getByRole("columnheader", { name: "Topic" }).first()).toBeVisible();
        });

        test("roadmap table lists known topics", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/roadmap");
            await expect(page.getByRole("cell", { name: "Arrays", exact: true })).toBeVisible();
            await expect(page.getByRole("cell", { name: "Hashtable", exact: true })).toBeVisible();
        });

        test("clicking a topic link navigates to the topic page", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/roadmap");
            await page.getByRole("link", { name: "Arrays" }).click();
            await expect(page).toHaveURL(/\/data-structures-and-algorithms\/topic\/array/);
            await expect(page.getByRole("heading", { name: "Array", level: 1 })).toBeVisible();
        });
    });

    test.describe("topic page", () => {
        test("loads and renders the topic heading and MDX content", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await expect(page).toHaveURL(/\/data-structures-and-algorithms\/topic\/array/);
            await expect(page.getByRole("heading", { name: "Array", level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: /what is an array/i })).toBeVisible();
        });

        test("shows the exercises table", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await expect(page.getByRole("heading", { name: /exercises/i })).toBeVisible();
            await expect(page.getByRole("columnheader", { name: "Exercise" })).toBeVisible();
            await expect(page.getByRole("link", { name: "Move Zeroes" })).toBeVisible();
        });

        test("shows breadcrumb navigation", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
            await expect(page.getByRole("link", { name: "DSA" })).toBeVisible();
        });

        test("renders a collapsed reading companion table of contents", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await expect(page.getByText("Contents", { exact: true })).toBeVisible();
            await expect(page.getByRole("button", { name: /Operations and Time Complexity/i }).first()).toBeHidden();
        });

        test("expanding the table of contents reveals a navigable entry", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            await expect(page.getByRole("button", { name: /Operations and Time Complexity/i }).first()).toBeVisible();
        });

        test("clicking a table of contents entry scrolls to its heading", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            await page.getByRole("button", { name: /Operations and Time Complexity/i }).first().click();
            await expect(page.getByRole("heading", { name: /Operations and Time Complexity/i })).toBeInViewport();
        });

        test("clicking an exercise link navigates to the exercise page", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByRole("link", { name: "Move Zeroes" }).click();
            await expect(page).toHaveURL(/\/data-structures-and-algorithms\/topic\/array\/exercise\/move-zeros/);
            await expect(page.getByRole("heading", { name: "Move Zeroes", level: 1 })).toBeVisible();
        });
    });

    test.describe("exercise page", () => {
        test("loads and renders the exercise heading and content", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array/exercise/move-zeros");
            await expect(page).toHaveURL(/\/data-structures-and-algorithms\/topic\/array\/exercise\/move-zeros/);
            await expect(page.getByRole("heading", { name: "Move Zeroes", level: 1 })).toBeVisible();
            await expect(page.getByRole("heading", { name: /problem summary/i })).toBeVisible();
        });

        test("shows breadcrumb with DSA and topic links", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array/exercise/move-zeros");
            const breadcrumb = page.getByRole("navigation", { name: "Breadcrumb" });
            await expect(breadcrumb.getByRole("link", { name: "DSA" })).toBeVisible();
            await expect(breadcrumb.getByRole("link", { name: "Arrays" })).toBeVisible();
        });

        test("returns HTTP 200", async ({ page }) => {
            const response = await page.goto("/data-structures-and-algorithms/topic/array/exercise/move-zeros");
            expect(response?.status()).toBe(200);
        });

        test("never renders a reading companion table of contents, even though the page has 3 headings", async ({
            page,
        }) => {
            await page.goto("/data-structures-and-algorithms/topic/array/exercise/move-zeros");
            await expect(page.getByRole("navigation", { name: "Table of contents" })).toHaveCount(0);
        });
    });
});
