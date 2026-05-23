import { expect, test } from "@playwright/test";

test("renders the landing page content after the splash animation", async ({ page }) => {
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /A passionate Frontend Developer/i,
    })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    page.getByRole("heading", { exact: true, name: "Experience" })
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Zybra" })).toBeVisible();
  await expect(page.getByRole("link", { name: /contact me/i })).toHaveAttribute(
    "href",
    "mailto:hello@example.com"
  );
});

test("validates the CV download flow in the browser", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: /download cv/i }).click({ timeout: 10_000 });
  await expect(page.getByRole("dialog")).toBeVisible();

  await page.getByRole("button", { name: /download cv/i }).click();

  await expect(page.getByText("Please enter your name.")).toBeVisible();
  await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
  await expect(page.getByText("Please share a little more context.")).toBeVisible();
});
