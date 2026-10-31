import { expect, test } from "@playwright/test";
import type { BookshelfSummary } from "../../shared/contracts/bookshelf";
import { bookshelfLabels, enabledBookshelfTypes } from "../../shared/contracts/bookshelf";

test("original notes have their own category, reader, and canonical URL", async ({ page, request }) => {
    const { data: catalog }: { data: BookshelfSummary[] } = await (await request.get("/api/bookshelf")).json();
    const note = catalog.find(item => item.type === "note");
    test.skip(!note, "No published original note is available");
    await page.goto("/bookshelf?type=note");
    await expect(page).toHaveURL(new RegExp(`/bookshelf/${note!.slug}\\?type=note`));
    await expect(page.getByRole("heading", { name: note!.title, exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Note", exact: true })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Bookshelf categories" }).getByRole("link", { name: /^Notes / })).toHaveAttribute("aria-current", "page");
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/bookshelf/${note!.slug}$`));
    for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: `.next/bookshelf-qa/note-${width}.png`, fullPage: true });
    }
});

test("database-backed shelf, filtering, direct links, and browser history", async ({ page, request }) => {
    const response = await request.get("/api/bookshelf");
    expect(response.status()).toBe(200);
    const { data: catalog }: { data: BookshelfSummary[] } = await response.json();
    await page.goto("/bookshelf");
    const bookshelfNavigation = page.locator("header").getByRole("link", { name: "Bookshelf", exact: true });
    await expect(bookshelfNavigation).toHaveAttribute("aria-current", "page");
    await expect(bookshelfNavigation).toHaveClass(/font-bold/);
    await expect(bookshelfNavigation).toHaveClass(/text-primary/);
    await expect(bookshelfNavigation).toHaveCSS("font-weight", "700");
    await expect(bookshelfNavigation.locator("[data-active-indicator]")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Bookshelf." })).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Bookshelf categories" })).toBeVisible();
    if (!catalog.length) {
        await expect(page.getByText("Nothing here yet.")).toBeVisible();
        return;
    }
    const first = catalog[0];
    expect(first).not.toHaveProperty("notes");
    await expect(page.locator(`#shelf-${first.slug}`)).toBeVisible();
    const search = page.getByRole("searchbox");
    await search.fill("no-such-entry-918273");
    await expect(page.getByText("No items match your search.")).toBeVisible();
    await expect(page).toHaveURL(/q=no-such-entry-918273/);
    await page.getByRole("button", { name: "Clear search" }).first().click();
    await expect(page.locator(`#shelf-${first.slug}`)).toBeVisible();
    await page.locator(`#shelf-${first.slug}`).click();
    await expect(bookshelfNavigation).toHaveAttribute("aria-current", "page");
    await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    await expect(page).toHaveURL(new RegExp(`/bookshelf/${first.slug}`));
    await page.reload();
    await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    await page.getByRole("link", { name: "Back to bookshelf", exact: true }).click();
    await expect(page).toHaveURL(/\/bookshelf$/);
    await expect(search).toBeVisible();
    await page.goBack();
    await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    await page.goto(`/bookshelf/${first.slug}`);
    await expect(page.getByRole("link", { name: "Back to bookshelf", exact: true })).toHaveAttribute("href", "/bookshelf");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toContain(first.type === "book" || first.type === "course" ? `/recommendations/${first.slug}` : `/bookshelf/${first.slug}`);
    const missing = await page.goto("/bookshelf/no-such-item-918273");
    expect(missing?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This item is not on the shelf" })).toBeVisible();
});

test("responsive themes, mobile reading, and failed artwork", async ({ page, request }) => {
    const { data: catalog }: { data: BookshelfSummary[] } = await (await request.get("/api/bookshelf")).json();
    await page.route("**/*", route => route.request().resourceType() === "image" ? route.abort() : route.continue());
    for (const width of [320, 768, 1024, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("/bookshelf");
        for (const dark of [false, true]) {
            await page.evaluate(isDark => document.documentElement.classList.toggle("dark", isDark), dark);
            await expect(page.getByRole("heading", { name: "Bookshelf." })).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
            if (width === 1440 && catalog.length) {
                const columns = await page.locator('section[aria-label="Collection"] > ul').evaluate(element => getComputedStyle(element).gridTemplateColumns.split(" ").length);
                expect(columns).toBe(6);
            }
            await page.screenshot({ path: `.next/bookshelf-qa/shelf-${width}-${dark ? "dark" : "light"}.png`, fullPage: true });
        }
        if (catalog.length) {
            await page.locator(`#shelf-${catalog[0].slug}`).click();
            await expect(page.getByRole("heading", { name: catalog[0].title, exact: true })).toBeVisible();
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
            await page.screenshot({ path: `.next/bookshelf-qa/reader-${width}.png`, fullPage: true });
            if (width === 320) await expect(page.getByRole("searchbox")).not.toBeVisible();
        }
    }
});

test("categories open their first item, empty results have no reader, and chapter back links work", async ({ page, request }) => {
    await page.setViewportSize({ width: 1440, height: 1000 });
    const { data: catalog }: { data: BookshelfSummary[] } = await (await request.get("/api/bookshelf")).json();
    if (!catalog.length) { await page.goto("/bookshelf"); await expect(page.getByText("Nothing here yet.")).toBeVisible(); return; }
    const first = catalog[0];
    await page.goto(`/bookshelf?type=${first.type}`);
    await expect(page).toHaveURL(new RegExp(`/bookshelf/${first.slug}\\?type=${first.type}`));
    await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    await expect(page.locator(`[id="shelf-${first.slug}"]`)).toHaveAttribute("aria-current", "page");
    await page.screenshot({ path: ".next/bookshelf-qa/auto-selected.png", fullPage: true });
    const emptyType = enabledBookshelfTypes.find(type => !catalog.some(item => item.type === type));
    if (emptyType) {
        await page.getByRole("link", { name: `${bookshelfLabels[emptyType]} 0`, exact: true }).click();
        await expect(page.getByText("Nothing here yet.")).toBeVisible();
        await expect(page.locator('[aria-label="Item notes"]')).toHaveCount(0);
        await page.screenshot({ path: ".next/bookshelf-qa/empty-category.png", fullPage: true });
        await page.getByRole("link", { name: `${bookshelfLabels[first.type]} ${catalog.filter(item => item.type === first.type).length}`, exact: true }).click();
        await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    }
    await page.getByRole("searchbox").fill("no-match-482930");
    await expect(page.getByText("No items match your search.")).toBeVisible();
    await expect(page.locator('[aria-label="Item notes"]')).toHaveCount(0);
    await expect(page).toHaveURL(/q=no-match-482930/);
    await page.getByRole("button", { name: "Clear search" }).first().click();
    await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    const chapter = page.locator('a[href^="/recommendations/"]').first();
    if (await chapter.count()) {
        await chapter.click();
        await expect(page).toHaveURL(/\/recommendations\/[^/]+\/[^/]+$/);
        await expect(page.locator("header").getByRole("link", { name: "Bookshelf", exact: true })).toHaveAttribute("aria-current", "page");
        await page.getByRole("link", { name: `Back to ${first.title}`, exact: true }).click();
        await expect(page).toHaveURL(new RegExp(`/bookshelf/${first.slug}`));
        await expect(page.getByRole("heading", { name: first.title, exact: true })).toBeVisible();
    }
});
