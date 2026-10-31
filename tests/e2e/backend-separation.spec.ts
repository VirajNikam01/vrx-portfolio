import { expect, test } from "@playwright/test";
import { landingPageContent } from "../../config/landing-page";

test.beforeEach(async ({ page }) => {
    // Keep browser flow checks independent of external services and database writes.
    await page.route("**/api/visitors", route => route.fulfill({ json: { success: true } }));
    await page.route("**/api/content/landing-page", route => route.fulfill({ json: { data: landingPageContent } }));
    await page.route("**/api/blog", route => route.fulfill({ json: { data: [] } }));
    await page.route("**/api/recommendations**", route => route.fulfill({ json: { data: [] } }));
});

test("homepage renders and recommendations navigation works", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Software Engineer");
    await expect(page.getByRole("heading", { name: "Experience", exact: true })).toBeVisible();
    await expect(page.locator("body")).toHaveCSS("font-family", /Poppins/i);
    await page.locator("#recommendations").getByRole("link", { name: "See all" }).click();
    await expect(page).toHaveURL(/\/recommendations$/);
    await expect(page.getByRole("heading", { name: "Recommendations", exact: true })).toBeVisible();
});

test("contact form submits through its frontend API client", async ({ page }) => {
    let submission: Record<string, unknown> | undefined;
    await page.route("**/api/inquiries", async route => {
        submission = route.request().postDataJSON();
        await route.fulfill({ status: 201, json: { data: { id: 1 } } });
    });
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.getByLabel(/full name/i).fill("Asha Shah");
    await contact.getByLabel(/email address/i).fill("asha@example.com");
    await contact.getByLabel(/message/i).fill("I would like to discuss a dashboard project with you.");
    await contact.getByRole("button", { name: "Send Message" }).click();
    await expect(contact.getByText("Thanks, your message has been sent. I'll get back to you soon.")).toBeVisible();
    expect(submission).toMatchObject({ source: "contact_me", name: "Asha Shah", email: "asha@example.com" });
});

test("resume dialog validates and opens the returned signed URL", async ({ page }) => {
    await page.route("**/api/inquiries", route => route.fulfill({
        status: 201, json: { data: { id: 2, resumeUrl: "https://example.com/signed-resume" } },
    }));
    await page.goto("/");
    await page.evaluate(() => {
        window.open = (url) => {
            document.body.dataset.openedResume = String(url);
            return null;
        };
    });
    await page.getByRole("button", { name: /download cv/i }).click();
    const dialog = page.getByRole("dialog");
    await dialog.getByRole("button", { name: /download cv/i }).click();
    await expect(dialog.getByText("Please enter your name.")).toBeVisible();
    await dialog.getByLabel(/full name/i).fill("Asha Shah");
    await dialog.getByLabel(/email address/i).fill("asha@example.com");
    await dialog.getByLabel(/message/i).fill("I would like to review your frontend experience.");
    await dialog.getByRole("button", { name: /download cv/i }).click();
    await expect(page.locator("body")).toHaveAttribute("data-opened-resume", "https://example.com/signed-resume");
    await expect(dialog).not.toBeVisible();
});

test("live inquiry endpoint preserves validation errors without external side effects", async ({ request }) => {
    const response = await request.post("/api/inquiries", { data: {} });
    expect(response.status()).toBe(400);
    const responseBody = await response.json();
    expect(responseBody).toMatchObject({ error: "Invalid inquiry submission." });
    const visitor = await request.post("/api/visitors", { data: {} });
    expect(visitor.status()).toBe(422);
    const visitorBody = await visitor.json();
    expect(visitorBody).toMatchObject({ success: false });
});
