# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> validates the CV download flow in the browser
- Location: tests\e2e\home.spec.ts:22:5

# Error details

```
TimeoutError: locator.click: Timeout 10000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /download cv/i })

```

# Page snapshot

```yaml
- main [ref=e2]:
  - img "hello" [ref=e5]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("renders the landing page content after the splash animation", async ({ page }) => {
  4  |   await page.goto("/");
  5  | 
  6  |   await expect(
  7  |     page.getByRole("heading", {
  8  |       level: 1,
  9  |       name: /A passionate Software Engineer/i,
  10 |     })
  11 |   ).toBeVisible({ timeout: 15_000 });
  12 |   await expect(
  13 |     page.getByRole("heading", { exact: true, name: "Experience" })
  14 |   ).toBeVisible();
  15 |   await expect(page.getByRole("heading", { name: "Zybra" })).toBeVisible();
  16 |   await expect(page.getByRole("link", { name: /contact me/i })).toHaveAttribute(
  17 |     "href",
  18 |     "mailto:virajnikam.connect@gmail.com"
  19 |   );
  20 | });
  21 | 
  22 | test("validates the CV download flow in the browser", async ({ page }) => {
  23 |   await page.goto("/");
  24 | 
> 25 |   await page.getByRole("button", { name: /download cv/i }).click({ timeout: 10_000 });
     |                                                            ^ TimeoutError: locator.click: Timeout 10000ms exceeded.
  26 |   await expect(page.getByRole("dialog")).toBeVisible();
  27 | 
  28 |   await page.getByRole("button", { name: /download cv/i }).click();
  29 | 
  30 |   await expect(page.getByText("Please enter your name.")).toBeVisible();
  31 |   await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  32 |   await expect(page.getByText("Please share a little more context.")).toBeVisible();
  33 | });
  34 | 
```