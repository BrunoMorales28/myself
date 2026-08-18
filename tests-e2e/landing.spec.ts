import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("home page redirects to a locale and renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL(/\/(en|es)\/?$/);
  await expect(
    page.getByRole("heading", {
      name: "Bruno Morales — Web Developer",
      level: 1,
    }),
  ).toBeVisible();
});

test("landing lists experience, studies, and hobbies with working highlight links", async ({
  page,
}) => {
  await page.goto("/en");

  await expect(
    page.getByRole("heading", { name: "Experience", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Studies", level: 2 }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Hobbies", level: 2 }),
  ).toBeVisible();

  const experienceLinks = page.locator('a[href*="/en/experience?highlight="]');
  await expect(experienceLinks).toHaveCount(4);

  await experienceLinks.first().click();
  await expect(page).toHaveURL(/\/en\/experience\?highlight=/);
});

test("language switcher changes locale and keeps the current page", async ({
  page,
}) => {
  await page.goto("/en");
  await page.getByRole("button", { name: "ES" }).click();
  await expect(page).toHaveURL(/\/es\/?$/);
});

for (const locale of ["en", "es"] as const) {
  test(`landing page (${locale}) has no accessibility violations`, async ({
    page,
  }) => {
    await page.goto(`/${locale}`);
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
