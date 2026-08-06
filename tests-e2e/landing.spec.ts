import { test, expect } from "@playwright/test";

test("home page redirects to a locale and renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|es)\/?$/);
  await expect(
    page.getByRole("heading", { name: "myself", level: 1 }),
  ).toBeVisible();
});

test("language switcher changes locale and keeps the current page", async ({
  page,
}) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es\/?$/);
});
