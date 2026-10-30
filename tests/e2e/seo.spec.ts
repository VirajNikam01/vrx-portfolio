import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
    await page.route("**/api/visitors", route => route.fulfill({ json: { success: true } }));
    await page.route("**/api/blog", route => route.fulfill({ json: { data: [] } }));
    await page.route("**/api/recommendations**", route => route.fulfill({ json: { data: [] } }));
});

test("homepage renders complete JSON-LD and a single site title", async ({ page, request }) => {
    await page.goto("/");
    await expect(page).toHaveTitle("Viraj Nikam | Software Engineer");
    const jsonText = await page.locator('script[type="application/ld+json"]').textContent();
    const entries = JSON.parse(jsonText!);
    expect(entries.map((entry: { "@type": string }) => entry["@type"])).toEqual(["WebSite", "Person", "ProfilePage", "ItemList"]);
    expect(entries[1].name).toBe("Viraj Nikam");
    const image = await page.locator('meta[name="twitter:image"]').getAttribute("content");
    const imageUrl = new URL(image!);
    expect(imageUrl.pathname).toBe("/opengraph-image.jpg");
    const imageResponse = await request.get(imageUrl.pathname);
    expect(imageResponse.status()).toBe(200);
    expect(imageResponse.headers()["content-type"]).toContain("image/jpeg");
});

for (const [path, title] of [["/blogs", "Blog | Viraj Nikam"], ["/recommendations", "Recommendations & Book Notes | Viraj Nikam"]]) {
    test(`${path} has its own canonical and social metadata`, async ({ page }) => {
        await page.goto(path);
        await expect(page).toHaveTitle(title);
        const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
        const socialUrl = await page.locator('meta[property="og:url"]').getAttribute("content");
        expect(new URL(canonical!).pathname).toBe(path);
        expect(new URL(socialUrl!).pathname).toBe(path);
        await expect(page.locator('meta[name="keywords"]')).toHaveCount(0);
    });
}

test("sitemap and crawler endpoints contain valid discovery links", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const xml = await response.text();
    expect(xml).toContain("/blogs</loc>");
    expect(xml).toContain("/recommendations</loc>");
    for (const path of ["/installation", "/theme", "/work-experience"]) expect(xml).not.toContain(`${path}</loc>`);
    const robots = await request.get("/robots.txt");
    const robotsText = await robots.text();
    expect(robotsText).toContain("Disallow: /api/");
    expect(robotsText).toContain("/sitemap.xml");
    const llms = await request.get("/llms.txt");
    const llmsText = await llms.text();
    expect(llmsText).not.toContain("/resume.pdf");
    expect(llmsText).toContain("/recommendations");
});
