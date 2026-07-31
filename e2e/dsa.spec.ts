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
            // Scoped to the TOC's own landmark: the page's real "Operations and Time Complexity" heading
            // is wrapped in its own `.heading-anchor` permalink, an unrelated link with an overlapping name.
            const toc = page.getByRole("navigation", { name: "Table of contents" });
            await expect(toc.getByRole("link", { name: /Operations and Time Complexity/i })).toBeHidden();
        });

        test("expanding the table of contents reveals a navigable entry", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            const toc = page.getByRole("navigation", { name: "Table of contents" });
            await expect(toc.getByRole("link", { name: /Operations and Time Complexity/i })).toBeVisible();
        });

        test("clicking a table of contents entry scrolls to its heading and updates the URL hash", async ({
            page,
        }) => {
            // Default motion path on purpose: the click is a real `<a href="#id">`, no JS-driven
            // scrollIntoView/history.pushState, so there is nothing here to race the App Router's own
            // scroll restoration the way a manual pushState call used to.
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            const toc = page.getByRole("navigation", { name: "Table of contents" });
            await toc.getByRole("link", { name: /Operations and Time Complexity/i }).click();
            await expect(page.getByRole("heading", { name: /Operations and Time Complexity/i })).toBeInViewport();
            await expect(page).toHaveURL(/#operations-and-time-complexity$/);
        });

        test("a group heading with children is itself navigable via its own anchor", async ({ page }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            const toc = page.getByRole("navigation", { name: "Table of contents" });

            const groupLink = toc.getByRole("link", { name: /What is an Array\?/i });
            await expect(groupLink).toBeVisible();
            await groupLink.click();
            // The rendered heading itself carries a "# " permalink prefix (rehype-autolink-headings), so it
            // is matched without anchoring the regex to the start of its accessible name.
            await expect(page.getByRole("heading", { name: /What is an Array\?/i })).toBeInViewport();
            await expect(page).toHaveURL(/#what-is-an-array/);
        });

        test("scrolls a genuinely long distance to reach a heading near the bottom of the page, on the default (animated) motion path", async ({
            page,
        }) => {
            // Regression coverage for the scroll-abort bug: a manual `window.history.pushState` call inside
            // the click handler used to be read by the App Router as a soft navigation, which replayed the
            // router's own scroll restoration against a stale cached position ~100-300ms into the smooth
            // scroll and aborted it a few hundred pixels in. Asserting only `toBeInViewport()` on a heading
            // close to the top of the page would not have caught that, so this heading ("Cache Locality and
            // Performance") sits near the very end of the article, and the scroll distance is asserted
            // directly rather than inferred from visibility alone.
            await page.goto("/data-structures-and-algorithms/topic/array");
            const startingScrollY = await page.evaluate(() => window.scrollY);
            await page.getByText("Contents", { exact: true }).click();
            const toc = page.getByRole("navigation", { name: "Table of contents" });
            await toc.getByRole("link", { name: /Cache Locality and Performance/i }).click();

            await expect(page.getByRole("heading", { name: /Cache Locality and Performance/i })).toBeInViewport();
            await expect(page).toHaveURL(/#cache-locality-and-performance$/);
            const finalScrollY = await page.evaluate(() => window.scrollY);
            expect(finalScrollY - startingScrollY).toBeGreaterThan(2000);
        });

        test("a group heading's own toggle reveals its child entries independently of scroll-spy", async ({
            page,
        }) => {
            await page.goto("/data-structures-and-algorithms/topic/array");
            await page.getByText("Contents", { exact: true }).click();
            const toc = page.getByRole("navigation", { name: "Table of contents" });

            // Asserted via aria-expanded rather than the child link's visibility: the collapsed panel is
            // clipped by its ancestor's `overflow-hidden` + animated `height: 0`, which Playwright's
            // visibility check does not treat as hidden (it only inspects the element's own box, not an
            // ancestor's overflow clipping) even though no real user would see the content.
            // Uses a group scroll-spy hasn't touched (the page never scrolled), isolating the toggle's own
            // expand/collapse behavior from scroll-spy's separate "force open the active group" behavior.
            const toggle = toc.getByRole("button", { name: /Toggle Classification of Arrays section/i });
            await expect(toggle).toHaveAttribute("aria-expanded", "false");
            await toggle.click();
            await expect(toggle).toHaveAttribute("aria-expanded", "true");
            await expect(toc.getByRole("link", { name: /Static vs Dynamic Arrays/i })).toBeVisible();
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
