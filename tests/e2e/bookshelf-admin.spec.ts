import { test, expect, type Page } from "@playwright/test";
import postgres from "postgres";
import { adminItemSchema, type AdminItem } from "../../shared/contracts/bookshelf-admin";
import { editableFeatureFlags, type FeatureFlagsSettings } from "../../shared/contracts/site-settings";

test.describe.configure({ mode: "serial" });
test.skip(!process.env.ADMIN_TEST_PASSWORD || !process.env.DATABASE_URL, "Private test credentials and database configuration are required");
const createdIds: number[] = [];
const prefix = `qa-admin-${Date.now()}`;

async function login(page: Page) {
    await page.goto("/admin/login");
    await page.getByLabel("Email", { exact: true }).fill(process.env.ADMIN_EMAIL!);
    await page.getByLabel("Password", { exact: true }).fill(process.env.ADMIN_TEST_PASSWORD!);
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Manage website" })).toBeVisible({ timeout: 20000 });
    await page.getByRole("navigation", { name: "Admin modules" }).getByRole("link", { name: "Bookshelf", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Manage bookshelf" })).toBeVisible({ timeout: 20000 });
}

test.afterAll(async () => {
    if (!process.env.DATABASE_URL || !createdIds.length) return;
    const sql = postgres(process.env.DATABASE_URL, { prepare: false, max: 1 });
    try {
        // These IDs were created by this test and were never published.
        for (const id of createdIds) await sql.unsafe("delete from recommendations where id=$1 and slug like $2 and is_visible=false", [id, `${prefix}%`]);
    } finally { await sql.end({ timeout: 2 }); }
});

test.afterEach(async ({ page }, info) => {
    const origin = new URL(String(info.project.use.baseURL ?? "http://localhost:3100")).origin;
    await page.request.post(`${origin}/api/admin/auth/logout`, { data: {}, headers: { Origin: origin, "x-admin-request": "1" } }).catch(() => {});
});

test("protects the workspace, saves a private draft and chapter, and preserves failed edits", async ({ page, request }) => {
    const anonymous = await request.get("/api/admin/bookshelf");
    expect(anonymous.status()).toBe(401);
    expect(anonymous.headers()["cache-control"]).toContain("no-store");
    await page.goto("/admin/bookshelf/new");
    await expect(page).toHaveURL(/\/admin\/login/);
    await login(page);
    const sessionCookie = (await page.context().cookies()).find(cookie => cookie.name === "bookshelf_admin_session")!;
    expect(sessionCookie.httpOnly).toBe(true);
    expect(sessionCookie.sameSite).toBe("Strict");
    const existing: AdminItem[] = (await (await page.request.get("/api/admin/bookshelf")).json()).data;
    const published = existing.find(item => item.isVisible);
    if (published) {
        await page.goto(`/admin/bookshelf/${published.id}/edit`);
        await expect(page.getByLabel("URL slug", { exact: true })).toBeDisabled();
        await page.getByRole("link", { name: "All content" }).click();
        await expect(page.getByRole("heading", { name: "Manage bookshelf" })).toBeVisible();
    }
    await page.getByRole("link", { name: "Add item", exact: true }).click();
    await page.getByLabel("Title", { exact: true }).fill("Private admin workflow verification");
    await page.getByLabel("Author / Creator").fill("Test author");
    await page.getByLabel("URL slug", { exact: true }).fill(`${prefix}-book`);
    await page.getByLabel("Description", { exact: true }).fill("Disposable private draft used to verify the content editor.");
    await page.getByLabel("Personal notes (Markdown)").fill("## A private note\n\nThis draft is not published.");
    const savedResponse = page.waitForResponse(response => response.url().endsWith("/api/admin/bookshelf") && response.request().method() === "POST");
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    const response = await savedResponse;
    expect(response.status()).toBe(201);
    const { data: item }: { data: AdminItem } = await response.json();
    createdIds.push(item.id);
    await expect(page).toHaveURL(new RegExp(`/admin/bookshelf/${item.id}/edit`));
    await expect(page.getByText("All changes saved", { exact: true })).toBeVisible();
    expect((await request.get(`/api/bookshelf/${item.slug}`)).status()).toBe(404);
    expect((await request.get(`/api/recommendations/${item.slug}`)).status()).toBe(404);
    const source = await (await request.get(`/bookshelf/${item.slug}`)).text();
    expect(source).not.toContain("This draft is not published.");
    await page.getByRole("button", { name: "Preview item", exact: true }).click();
    await expect(page.getByRole("region", { name: "Private preview" })).toContainText("A private note");
    await page.getByRole("button", { name: "Back to editor", exact: true }).click();
    await page.reload();
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue(item.title);
    const apiPath = `**/api/admin/bookshelf/${item.id}`;
    await page.route(apiPath, route => route.request().method() === "PATCH" ? route.fulfill({ status: 401, json: { error: "Your session has expired. Sign in again, then retry saving." } }) : route.continue());
    await page.getByLabel("Title", { exact: true }).fill("An unsaved change retained after failure");
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await expect(page.getByRole("link", { name: "Sign in again in a new tab" })).toBeVisible();
    await expect(page.getByLabel("Title", { exact: true })).toHaveValue("An unsaved change retained after failure");
    await page.unroute(apiPath);
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await expect(page.getByText("Draft saved. This item is private.")).toBeVisible();
    await page.getByRole("link", { name: "Add topic", exact: true }).click();
    await page.getByLabel("Topic title", { exact: true }).fill("Private chapter");
    await page.getByLabel("Topic URL slug").fill("private-chapter");
    await page.getByLabel("Topic notes (Markdown)").fill("## Chapter draft\n\nPrivate content.");
    await page.getByRole("button", { name: "Save draft", exact: true }).click();
    await expect(page.getByText("All changes saved", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Preview notes", exact: true }).click();
    await expect(page.getByRole("region", { name: "Private notes preview" })).toContainText("Chapter draft");
    expect((await request.get(`/api/recommendations/${item.slug}/topics/private-chapter`)).status()).toBe(404);
    const protectedResponse = await page.request.get(`/api/admin/bookshelf/${item.id}`);
    const { data: current }: { data: AdminItem } = await protectedResponse.json();
    const body = adminItemSchema.strip().parse(current);
    const origin = new URL(page.url()).origin;
    const stale = await page.request.patch(`/api/admin/bookshelf/${item.id}`, { data: { ...body, version: 0 }, headers: { Origin: origin, "x-admin-request": "1" } });
    expect(stale.status()).toBe(409);
    const blockedType = await page.request.patch(`/api/admin/bookshelf/${item.id}`, { data: { ...body, type: "movie" }, headers: { Origin: origin, "x-admin-request": "1" } });
    expect(blockedType.status()).toBe(422);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
    expect((await page.request.get("/api/admin/bookshelf")).status()).toBe(401);
    expect((await request.get("/api/admin/bookshelf", { headers: { Cookie: `${sessionCookie.name}=${sessionCookie.value}` } })).status()).toBe(401);
});

test("responsive owner dashboard and editor preserve theme and layout", async ({ page }) => {
    await login(page);
    for (const width of [320, 768, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.goto("/admin/bookshelf");
        await expect(page.getByRole("heading", { name: "Manage bookshelf" })).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: `.next/admin-qa/dashboard-${width}.png`, fullPage: true });
        await page.goto("/admin/bookshelf/new");
        await expect(page.getByRole("heading", { name: "Add item" })).toBeVisible();
        for (const dark of [false, true]) {
            await page.evaluate(value => document.documentElement.classList.toggle("dark", value), dark);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
            await page.screenshot({ path: `.next/admin-qa/editor-${width}-${dark ? "dark" : "light"}.png`, fullPage: true });
        }
    }
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
});

test("shared admin modules expose database-backed flags without changing live settings", async ({ page, request }) => {
    expect((await request.get("/api/admin/settings/feature-flags")).status()).toBe(401);
    await login(page);
    await page.getByRole("navigation", { name: "Admin modules" }).getByRole("link", { name: "Overview", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Manage website" })).toBeVisible();
    await page.getByRole("navigation", { name: "Admin modules" }).getByRole("link", { name: "Feature flags", exact: true }).click();
    const activeModule = page.getByRole("navigation", { name: "Admin modules" }).getByRole("link", { name: "Feature flags", exact: true });
    await expect(activeModule).toHaveAttribute("aria-current", "page");
    await expect(activeModule).toHaveCSS("font-weight", "700");
    await expect(activeModule).toHaveClass(/bg-primary\/10/);
    await expect(activeModule.locator("[data-active-indicator]")).toHaveCount(0);
    await expect(page.getByRole("navigation", { name: "Admin modules" }).getByRole("link", { name: "Overview", exact: true })).not.toHaveAttribute("aria-current");
    const { data: settings }: { data: FeatureFlagsSettings } = await (await page.request.get("/api/admin/settings/feature-flags")).json();
    for (const flag of editableFeatureFlags) await expect(page.getByRole("switch", { name: flag.label, exact: true })).toBeChecked({ checked: settings.flags[flag.key] });
    for (const width of [320, 1440]) {
        await page.setViewportSize({ width, height: 1000 });
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        await page.screenshot({ path: `.next/admin-qa/feature-flags-${width}.png`, fullPage: true });
    }
    const origin = new URL(page.url()).origin;
    const stale = await page.request.patch("/api/admin/settings/feature-flags", { data: { ...settings, version: settings.version === 2147483646 ? 0 : 2147483646 }, headers: { Origin: origin, "x-admin-request": "1" } });
    expect(stale.status()).toBe(409);
    await page.route("**/api/admin/settings/feature-flags", route => route.request().method() === "PATCH" ? route.fulfill({ status: 503, json: { error: "Temporarily unavailable" } }) : route.continue());
    const control = page.getByRole("switch", { name: "Introduction", exact: true });
    await control.setChecked(!settings.flags.showIntroduction);
    await page.getByRole("button", { name: "Save feature flags", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Temporarily unavailable" })).toBeVisible();
    await expect(control).toBeChecked({ checked: !settings.flags.showIntroduction });
    await page.unroute("**/api/admin/settings/feature-flags");
    await control.setChecked(settings.flags.showIntroduction);
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await expect(page).toHaveURL(/\/admin\/login/);
});
